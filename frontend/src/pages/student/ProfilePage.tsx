import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        My profile
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Basic student profile information. Extend this later with editing
        capabilities.
      </p>

      <div className="rounded-xl bg-white p-4 shadow-sm text-xs text-slate-700 space-y-2">
        <div>
          <span className="font-semibold">Name:</span> {user?.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user?.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user?.role}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

