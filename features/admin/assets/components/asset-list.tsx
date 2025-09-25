"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "@tanstack/react-query";
import {
  useConvexMutation,
  useConvexPaginatedQuery,
} from "@convex-dev/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AssetsSkeleton } from "@/features/admin/assets/components/asset-list.skeleton";
import AdminContainer from "@/features/admin/components/container";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { ListToolbar } from "@/features/admin/shared/components/list-toolbar";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import { formatBytes } from "@/features/admin/shared/utils/format-bytes";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { Button } from "@/features/shared/components/ui/button";

export function AssetList() {
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    results: assetResults,
    status: assetsStatus,
    loadMore: loadMoreAssets,
  } = useConvexPaginatedQuery(
    api.admin.assets.queries.list,
    {
      search: search.trim() ? search : undefined,
    },
    { initialNumItems: 20 },
  );

  const { mutateAsync: generateUploadUrl } = useMutation({
    mutationFn: useConvexMutation(
      api.admin.assets.mutations.generateUploadUrl,
    ),
  });
  const { mutateAsync: createFromUpload } = useMutation({
    mutationFn: useConvexMutation(
      api.admin.assets.mutations.createFromUpload,
    ),
  });
  const { mutateAsync: removeAsset } = useMutation({
    mutationFn: useConvexMutation(api.admin.assets.mutations.remove),
  });
  const { mutateAsync: touchAsset } = useMutation({
    mutationFn: useConvexMutation(api.admin.assets.mutations.touch),
  });

  const assetItems = assetResults;
  const isLoading = assetsStatus === "LoadingFirstPage";
  const isLoadingMore = assetsStatus === "LoadingMore";
  const canLoadMore = assetsStatus === "CanLoadMore" || isLoadingMore;
  const loadMoreButton = canLoadMore ? (
    <div className="flex justify-center pt-4">
      <Button
        type="button"
        variant="ghost"
        onClick={() => loadMoreAssets(20)}
        disabled={isLoadingMore}
      >
        {isLoadingMore ? "Loading..." : "Load more"}
      </Button>
    </div>
  ) : null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      const message =
        error instanceof Error ? error.message : "Failed to upload asset";
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (assetId: Id<"assets">) => {
    const confirmed = window.confirm(
      "Delete this asset? Uploads using it may break.",
    );
    if (!confirmed) return;
    try {
      await removeAsset({ assetId });
      toast.success("Asset deleted");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete asset";
      toast.error(message);
    }
  };

  const handleTouch = async (assetId: Id<"assets">) => {
    try {
      await touchAsset({ assetId });
      toast.success("Asset timestamp refreshed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh asset";
      toast.error(message);
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
          <Button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
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
        <div className="flex flex-col items-center gap-4">
          <EmptyState
            title="No assets yet"
            description="Upload images, thumbnails, and other files to reference in content."
          />
          {loadMoreButton}
        </div>
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
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatBytes(asset.size)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {asset.mimeType}
                  </td>
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
          {loadMoreButton}
        </div>
      )}
    </AdminContainer>
  );
}
