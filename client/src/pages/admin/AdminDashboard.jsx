import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Welcome back, Admin.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Applications
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                24
              </h2>
            </div>

            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Review
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                8
              </h2>
            </div>

            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Approved */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Approved
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                12
              </h2>
            </div>

            <CheckCircle className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Rejected */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Rejected
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                4
              </h2>
            </div>

            <XCircle className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

      </div>

 {/* Recent Applications */}
<div className="mt-8">

  <div className="mb-4">
    <h2 className="text-lg font-semibold">
      Recent Applications
    </h2>

    <p className="text-sm text-muted-foreground">
      Latest provider applications
    </p>
  </div>

  <div className="rounded-xl border bg-card">

    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead className="border-b">
          <tr className="text-left">
            <th className="px-6 py-4 font-medium">
              Provider
            </th>

            <th className="px-6 py-4 font-medium">
              Category
            </th>

            <th className="px-6 py-4 font-medium">
              Location
            </th>

            <th className="px-6 py-4 font-medium">
              Status
            </th>

            <th className="px-6 py-4 font-medium">
              Date
            </th>
          </tr>
        </thead>

        <tbody>

          <tr className="border-b last:border-0">
            <td className="px-6 py-4">
              Rahul Sharma
            </td>

            <td className="px-6 py-4">
              Electrician
            </td>

            <td className="px-6 py-4">
              Gangtok
            </td>

            <td className="px-6 py-4">
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                SUBMITTED
              </span>
            </td>

            <td className="px-6 py-4 text-muted-foreground">
              Sep 10, 2026
            </td>
          </tr>

          <tr className="border-b last:border-0">
            <td className="px-6 py-4">
              Aman Rai
            </td>

            <td className="px-6 py-4">
              Plumber
            </td>

            <td className="px-6 py-4">
              Tadong
            </td>

            <td className="px-6 py-4">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                APPROVED
              </span>
            </td>

            <td className="px-6 py-4 text-muted-foreground">
              Sep 9, 2026
            </td>
          </tr>

          <tr className="border-b last:border-0">
            <td className="px-6 py-4">
              Imran Khan
            </td>

            <td className="px-6 py-4">
              Carpenter
            </td>

            <td className="px-6 py-4">
              Deorali
            </td>

            <td className="px-6 py-4">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                REJECTED
              </span>
            </td>

            <td className="px-6 py-4 text-muted-foreground">
              Sep 8, 2026
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>

</div>
      

    </div>
  );
};

export default AdminDashboard;