"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

import AdminContainer from "@/features/admin/components/container";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import { ListToolbar } from "@/features/admin/shared/components/list-toolbar";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { Button } from "@/features/shared/components/ui/button";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { formatBytes } from "@/features/admin/shared/utils/format-bytes";
import { AssetsSkeleton } from "@/features/admin/assets/components/asset-list.skeleton";

export function AssetList() {
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const assets = useQuery(api.admin.assets.queries.list, {
    search: search || undefined,
    pagination: undefined,
  });

  const generateUploadUrl = useMutation(api.admin.assets.mutations.generateUploadUrl);
  const createFromUpload = useMutation(api.admin.assets.mutations.createFromUpload);
  const removeAsset = useMutation(api.admin.assets.mutations.remove);
  const touchAsset = useMutation(api.admin.assets.mutations.touch);

  const assetItems = useMemo(() => assets ?? [], [assets]);
  const isLoading = assets === undefined;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();
      await createFromUpload({
        storageId,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      });

      toast.success("Asset uploaded");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload asset";
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (assetId: Id<"assets">) => {
    const confirmed = window.confirm("Delete this asset? Uploads using it may break.");
    if (!confirmed) return;
    try {
      await removeAsset({ assetId });
      toast.success("Asset deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete asset";
      toast.error(message);
    }
  };

  const handleTouch = async (assetId: Id<"assets">) => {
    try {
      await touchAsset({ assetId });
      toast.success("Asset timestamp refreshed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to refresh asset";
      toast.error(message);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Copy failed");
    }
  };

  return (
    <AdminContainer className="flex flex-col gap-8">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <PageHeader
        title="Assets"
        description="Upload and manage media stored in Convex."
      >
        <div>
          <Button type="button" onClick={handleUploadClick} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </PageHeader>

  <ListToolbar
        value={search}
        onValueChange={setSearch}
        placeholder="Search by filename"
      />

      {isLoading ? (
        <AssetsSkeleton />
      ) : assetItems.length === 0 ? (
        <EmptyState
          title="No assets yet"
          description="Upload images, thumbnails, and other files to reference in content."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Filename
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Mime type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Uploaded
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {assetItems.map((asset) => (
                <tr key={asset._id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">
                    <div className="flex flex-col">
                      <span>{asset.filename}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-fit text-xs"
                        onClick={() => handleCopy(asset.storageId)}
                      >
                        Copy storage ID
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatBytes(asset.size)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{asset.mimeType}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(asset.updatedAt ?? asset._creationTime)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTouch(asset._id)}
                      >
                        Refresh
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(asset._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminContainer>
  );
}
