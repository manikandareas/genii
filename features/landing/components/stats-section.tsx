'use client';
import { motion } from 'motion/react';

const StatsSection = () => {
  return (
    <section className="pt-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.h2
          className="mx-auto max-w-xl text-balance text-center font-semibold text-3xl text-foreground md:text-4xl"
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        >
          <span className="text-muted-foreground">Dampak Belajar di</span> Genii
        </motion.h2>
        <div className="grid gap-10 pt-9 md:grid-cols-3 lg:gap-0 lg:pt-20">
          <div className="text-center">
            <p className="font-medium text-muted-foreground text-sm">
              Belajar skill baru sampai
            </p>
            <p className="pt-4 font-semibold text-5xl lg:pt-10">3x</p>
            <p className="font-semibold text-muted-foreground text-xl">
              lebih cepat
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium text-muted-foreground text-sm">
              Student selesaikan project dalam rata-rata
            </p>
            <p className="pt-4 font-semibold text-5xl lg:pt-10">2</p>
            <p className="font-semibold text-muted-foreground text-xl">
              minggu
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium text-muted-foreground text-sm">
              AI tutor respon dalam waktu kurang dari
            </p>
            <p className="pt-4 font-semibold text-5xl lg:pt-10">5</p>
            <p className="font-semibold text-muted-foreground text-xl">detik</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { StatsSection };
