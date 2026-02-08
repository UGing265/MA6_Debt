export const LoginForm = () => {
    return (
        <div className="flex flex-col gap-4 p-6 border rounded-lg shadow-sm w-full max-w-sm mx-auto mt-20">
            <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
            <input
                type="text"
                placeholder="Tên đăng nhập"
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                className="border p-2 rounded"
            />
            <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Đăng nhập ngay
            </button>
        </div>
    );
};
