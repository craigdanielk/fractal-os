export async function GET() {
  return Response.json({
    revenue: 0,
    labourCost: 0,
    overheadCost: 0,
    directExpenses: 0,
    totalCost: 0,
    contribution: 0,
    margin: 0
  });
}

