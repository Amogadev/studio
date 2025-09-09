
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const initialStores = [
  { id: "12", name: "Combai" },
  { id: "15", name: "Dayton" },
  { id: "20", name: "Highway" },
  { id: "22", name: "Mullai" },
  { id: "23", name: "Nanbargal" },
  { id: "24", name: "new boys" },
  { id: "25", name: "lakeview" },
  { id: "27", name: "royalrc" },
  { id: "29", name: "vaigai" },
  { id: "30", name: "Blue Sports" },
  { id: "32", name: "POLLACHI DIAMOND CLUB" },
  { id: "33", name: "PRINCE NEW CLUB" },
  { id: "34", name: "VAIGAI RAMNAD CLUB" },
  { id: "35", name: "COVAI FIVE STAR" },
  { id: "36", name: "COVAI MENS CLUB" },
  { id: "37", name: "Covai thendral" },
  { id: "38", name: "COVAI KING FHISHER" },
  { id: "39", name: "COVAI VAIGAI" },
  { id: "40", name: "COVAI KINGS" },
  { id: "42", name: "honeybee" },
  { id: "43", name: "Nanbargal Aranthangi" },
  { id: "44", name: "Chakra" },
  { id: "45", name: "JS" },
  { id: "46", name: "COVAI NO1" },
  { id: "47", name: "COVAI FRIENDS" },
  { id: "48", name: "FRINEDS SATUUR" },
];

interface SaleId {
  date: number;
  machineIdentifier: number;
  processIdentifier: number;
  counter: number;
  timestamp: number;
  time: number;
  timeSecond: number;
}

interface Product {
  purchaseStock?: number;
}

interface Sale {
  invoiceNumber: string;
  timeCreatedAt: number;
  _id: SaleId;
  purchaseStock?: number;
  productList?: Product[];
}

interface Store {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();
  const [selectedStore, setSelectedStore] = React.useState<string>("");
  const [sales, setSales] = React.useState<Sale[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const [stores, setStores] = React.useState<Store[]>(initialStores);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);


  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  const handleGetSales = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You are not logged in.",
      });
      router.push("/");
      return;
    }

    if (!selectedStore || !fromDate || !toDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a store and both from and to dates.",
      });
      return;
    }
    
    try {
      const fromTime = Math.floor(new Date(fromDate).getTime() / 1000);
      const toTime = Math.floor(new Date(toDate).getTime() / 1000);

      const queryParams = new URLSearchParams({
        shopNumber: selectedStore,
        fromTime: fromTime.toString(),
        toTime: toTime.toString(),
      });

      const response = await fetch(`https://tnfl2-cb6ea45c64b3.herokuapp.com/services/admin/sales?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const salesData = data.data || [];

        if (salesData.length === 0) {
          toast({
            title: "No Sales Found",
            description: "No sales were found for the selected criteria.",
          });
          setSales([]);
        } else {
            const detailedSalesPromises = salesData.map(async (sale: any) => {
              const detailResponse = await fetch(`https://tnfl2-cb6ea45c64b3.herokuapp.com/services/sales/id?id=${sale._id}`, {
                 method: 'GET',
                 headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              if(detailResponse.ok) {
                const detailData = await detailResponse.json();
                return { ...sale, ...detailData.data };
              }
              return null;
            });

            const detailedSales = (await Promise.all(detailedSalesPromises)).filter(Boolean) as Sale[];
            
            const salesWithTotalPurchaseStock = detailedSales.map(sale => {
              const totalPurchaseStock = sale.productList?.reduce((sum, product) => {
                const stock = (typeof product.purchaseStock === 'number' && !isNaN(product.purchaseStock)) ? product.purchaseStock : 0;
                return sum + stock;
              }, 0) ?? 0;
              return { ...sale, purchaseStock: totalPurchaseStock };
            });

            setSales(salesWithTotalPurchaseStock);
        }

      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to Fetch Sales",
          description: errorData.message || "An error occurred while fetching data.",
        });
        setSales([]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong. Please try again later.",
      });
      setSales([]);
    }
  };

  const totalPurchaseStock = sales.reduce((total, sale) => total + ((typeof sale.purchaseStock === 'number' && !isNaN(sale.purchaseStock)) ? sale.purchaseStock : 0), 0);


  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-xl font-semibold">WELCOME</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2" /> Logout
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Store</label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.sort((a, b) => a.name.localeCompare(b.name)).map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? (
                        format(fromDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? (
                        format(toDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleGetSales}>Get Report</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Purchase Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length > 0 ? (
                  sales.map((sale, index) => (
                    <TableRow key={`${typeof sale._id === 'object' && sale._id !== null ? sale._id.timestamp : sale._id}-${index}`}>
                      <TableCell>{format(new Date(sale.timeCreatedAt * 1000), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{(typeof sale.purchaseStock === 'number' && !isNaN(sale.purchaseStock)) ? sale.purchaseStock.toFixed(2) : '0.00'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">No sales to display.</TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={1} className="text-right font-bold">Total Purchase Stock</TableCell>
                  <TableCell className="font-bold">{totalPurchaseStock.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
