import { motion } from 'motion/react';

const HowItWorks = () => {
  return (
    <section className="" id="how-it-works">
      <div className="mx-auto max-w-7xl px-0 sm:px-8">
        <div className="container max-w-6xl px-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 ">
            <div className="mb-2 max-w-4xl">
              <motion.h2
                className="text-balance font-semibold text-3xl text-foreground md:text-5xl"
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              >
                <span className="text-muted-foreground">
                  Belajar Lebih Cepat Bareng
                </span>{' '}
                AI Companion Kamu
              </motion.h2>
            </div>
            <p className="max-w-[30rem] text-balance text-left text-base text-muted-foreground leading-snug tracking-wide sm:text-lg">
              Jalur personal, praktek langsung, bantuan instant—dirancang khusus
              untuk job tech Indonesia. Mulai dari nol sampai siap kerja!
            </p>
          </div>
        </div>
        <div className="sm:-right-[10%] relative mt-16 aspect-[1.2/1] overflow-hidden sm:right-auto sm:mt-16 sm:aspect-[2.788990826/1]">
          <div
            aria-hidden
            className="absolute inset-0 z-40 bg-linear-to-b from-35% from-transparent to-background "
          />
          <div className="absolute top-[11%] left-[8%] z-10 aspect-[0.7/1] w-[80%] sm:left-[4%] sm:w-[45%]">
            <div className="size-full [transform:rotateY(-30deg)_rotateX(-18deg)_rotate(-4deg)]">
              <img
                alt=""
                className="block size-full object-cover object-left"
                src="https://cdn.dribbble.com/userupload/18075737/file/original-d22337d78029b934b35c781ac7e36d06.png?resize=1504x1128&vertical=center"
              />
            </div>
          </div>
          <div className="-translate-x-1/2 absolute top-0 left-[70%] z-20 aspect-[0.7/1] w-[73%] sm:left-1/2 sm:w-[38%]">
            <div className="size-full shadow-[-25px_0px_20px_0px_rgba(0,0,0,.04)] [transform:rotateY(-30deg)_rotateX(-18deg)_rotate(-4deg)]">
              <img
                alt=""
                className="block size-full object-cover object-left"
                src="/app-ui.png"
              />
            </div>
          </div>
          <div className="-right-[45%] sm:-right-[2%] absolute top-[3%] z-30 aspect-[0.7/1] w-[85%] sm:w-[50%]">
            <div className="size-full shadow-[-25px_0px_20px_0px_rgba(0,0,0,.04)] [transform:rotateY(-30deg)_rotateX(-18deg)_rotate(-4deg)]">
              <img
                alt=""
                className="block size-full object-cover object-left"
                src="https://cdn.dribbble.com/userupload/18075737/file/original-d22337d78029b934b35c781ac7e36d06.png?resize=1504x1128&vertical=center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };
