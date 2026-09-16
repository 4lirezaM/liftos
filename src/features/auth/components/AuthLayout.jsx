const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="h-dvh overflow-hidden bg-background text-gray-900 transition-colors duration-300 dark:text-gray-100">
      <div className="flex h-full">
        {/* Branding */}
        <section className="relative hidden w-1/2 overflow-hidden lg:flex">
          <img
            src="/loginSidbar.png"
            alt="LiftOS fitness"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#090F18]/70" />

          <div className="relative z-10 flex w-full flex-col-reverse justify-between p-12">
            <div className="max-w-md">
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
                LiftOS
              </h1>

              <p className="text-lg leading-relaxed text-white/80">
                Track your workouts. Build consistency. Get stronger.
              </p>

              <div className="mt-8 h-1 w-20 rounded-full bg-[#44E092]" />
            </div>
          </div>
        </section>

        {/* Form Scroll Area */}
        <section
          className="
            relative
            flex
            h-full
            w-full
            items-center
            justify-center
            overflow-y-auto
            overflow-x-hidden
            px-5
            py-10
            [scrollbar-gutter:stable]
            sm:px-8
            lg:w-1/2
          "
        >
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

              {subtitle && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition-colors
                duration-300
                dark:border-white/10
                dark:bg-white/4
                dark:shadow-none
                sm:p-6
              "
            >
              {children}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
