export function UserProfileCard({ title, value, Icon }) {
    return (
        <div className="border border-gray-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-4">
                <Icon className="text-emerald-500 h-6 w-6 mr-4" />
                <h3 className="text-gray-800 font-semibold">{title}</h3>
            </div>
            <p className="text-gray-600">{value}</p>
        </div>
    );
}
