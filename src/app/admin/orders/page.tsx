import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

export default async function AdminOrdersPage() {
  const prisma = await getPrisma();
  
  // Get all purchases (contentTypes includes "purchase")
  const orders = await prisma.auditApplication.findMany({
    where: {
      contentTypes: {
        has: "purchase",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-black">
          ← Back to home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Content Starter Orders</h1>
      <p className="text-gray-600 mb-8">$997 purchases and their status</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200">
          <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusColors: Record<string, string> = {
              pending_payment: "bg-yellow-100 text-yellow-800",
              paid: "bg-blue-100 text-blue-800",
              processing: "bg-purple-100 text-purple-800",
              completed: "bg-green-100 text-green-800",
              generation_failed: "bg-red-100 text-red-800",
            };
            
            return (
              <div key={order.id} className="border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{order.name}</h2>
                    <p className="text-gray-600">{order.email}</p>
                    {order.businessName && (
                      <p className="text-sm text-gray-500">{order.businessName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm font-medium rounded ${statusColors[order.status] || "bg-gray-100"}`}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">
                      {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>Content length:</strong> {order.contentSample.length.toLocaleString()} characters</p>
                  {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                </div>
                
                <div className="flex gap-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Details →
                  </Link>
                  {order.status === "completed" && order.pdfUrl && (
                    <Link
                      href={`/admin/orders/${order.id}/content`}
                      className="text-sm text-green-600 hover:underline"
                    >
                      View Generated Content →
                    </Link>
                  )}
                  {order.status === "paid" && (
                    <form action={`/api/generate-starter`} method="POST">
                      <input type="hidden" name="auditApplicationId" value={order.id} />
                      <button
                        type="submit"
                        className="text-sm text-purple-600 hover:underline"
                      >
                        Trigger Generation →
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
