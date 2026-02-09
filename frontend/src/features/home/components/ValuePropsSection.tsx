import { CheckCircle, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "Minh bạch tài chính",
    description:
      "Theo dõi mọi khoản thu chi rõ ràng, giúp bạn hiểu rõ dòng tiền của mình đang đi đâu.",
    icon: ShieldCheck,
  },
  {
    name: "Ghi chép tức thì",
    description:
      "Nhập liệu nhanh chóng chỉ trong vài giây, mọi lúc mọi nơi, ngay trên điện thoại của bạn.",
    icon: Clock,
  },
  {
    name: "Kỷ luật 30 ngày",
    description:
      "Xây dựng thói quen quản lý tài chính bền vững với lộ trình 30 ngày được thiết kế khoa học.",
    icon: CheckCircle,
  },
];

export const ValuePropsSection = () => {
  return (
    <div className="bg-slate-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-amber-400">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Giải pháp quản lý tài chính đơn giản
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Chúng tôi tập trung vào những tính năng cốt lõi giúp bạn kiểm soát tài chính cá nhân hiệu quả nhất.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                    <feature.icon
                      className="h-6 w-6 text-amber-400"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
