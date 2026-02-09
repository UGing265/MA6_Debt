import { Settings, PlusCircle, FileText, BarChart3 } from "lucide-react";

const steps = [
  {
    name: "Thiết lập",
    description: "Cấu hình ví, túi tiền và các danh mục chi tiêu.",
    icon: Settings,
  },
  {
    name: "Giao dịch",
    description: "Ghi lại thu nhập và chi tiêu hàng ngày.",
    icon: PlusCircle,
  },
  {
    name: "Xử lý",
    description: "Phân loại và gắn thẻ các giao dịch để quản lý.",
    icon: FileText,
  },
  {
    name: "Rà soát",
    description: "Xem báo cáo và điều chỉnh kế hoạch tài chính.",
    icon: BarChart3,
  },
];

export const WorkflowSection = () => {
  return (
    <div className="bg-slate-950 py-24 sm:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-amber-400">
            Quy trình đơn giản
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cách thức hoạt động
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            4 bước đơn giản để làm chủ tài chính cá nhân của bạn.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.name} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                  <step.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-white">
                  {index + 1}. {step.name}
                </dt>
                <dd className="mt-1 text-base leading-7 text-slate-400">
                  {step.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
