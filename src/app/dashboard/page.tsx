
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Calendar as CalendarIcon, Loader2, LogOut } from "lucide-react";
import { format, addDays } from "date-fns";
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
  { id: "50", name: "Test Store" },
];

interface DailyReport {
    date: Date;
    totalSalesQuantity: number;
    totalPurchaseStock: number;
    totalSaleValue: number;
    totalPurchaseValue: number;
}


interface Store {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();
  const [selectedStore, setSelectedStore] = React.useState<string>("");
  const [reports, setReports] = React.useState<DailyReport[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingMaster, setIsFetchingMaster] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [productMasterData, setProductMasterData] = React.useState<any | null>(null);

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

  const handleGetProductMaster = async () => {
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

    if (!selectedStore) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a store.",
      });
      return;
    }
    
    setIsFetchingMaster(true);
    try {
      const queryParams = new URLSearchParams({
        shopNumber: selectedStore,
      });

      const response = await fetch(`https://tnfl2-cb6ea45c64b3.herokuapp.com/services/admin/account?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setProductMasterData(responseData);
        console.log('Product Master Data:', responseData);
        toast({
          title: "Success",
          description: "Product master data fetched successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to Fetch Product Master",
          description: errorData.message || `API Error with status: ${response.status}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong while fetching product master data.",
      });
    } finally {
      setIsFetchingMaster(false);
    }
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
    
    setIsLoading(true);
    try {
      const fromDateStart = new Date(fromDate);
      fromDateStart.setHours(0, 0, 0, 0);
      const fromTime = Math.floor(fromDateStart.getTime() / 1000);

      const toDateEnd = new Date(toDate);
      toDateEnd.setHours(23, 59, 59, 999);
      const toTime = Math.floor(toDateEnd.getTime() / 1000);

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
        const responseData = await response.json();
        const dayWiseData = responseData.data || [];

        if (dayWiseData.length === 0) {
          toast({
            title: "No Data Found",
            description: "No data was found for the selected criteria.",
          });
          setReports([]);
        } else {
            const productMap = new Map(productMasterData?.data?.productList?.map((p: any) => [p.SKU, p]) ?? []);
            const processedReports: DailyReport[] = dayWiseData.map((day: any, index: number) => {
              const dayTotalSalesQuantity = day.productList?.reduce((daySum: number, item: any) => {
                 const quantity = (typeof item.sales === 'number' && !isNaN(item.sales)) ? item.sales : 0;
                 return daySum + quantity;
              }, 0) ?? 0;
              
              const dayTotalPurchaseStock = day.productList?.reduce((daySum: number, item: any) => {
                 const stock = (typeof item.purchaseStock === 'number' && !isNaN(item.purchaseStock)) ? item.purchaseStock : 0;
                 return daySum + stock;
              }, 0) ?? 0;

              const dayTotalSaleValue = day.productList?.reduce((daySum: number, item: any) => {
                 const value = (typeof item.totalSaleAmount === 'number' && !isNaN(item.totalSaleAmount)) ? item.totalSaleAmount : 0;
                 return daySum + value;
              }, 0) ?? 0;

              const dayTotalPurchaseValue = day.productList?.reduce((daySum: number, item: any) => {
                const masterProduct = productMap.get(item.SKU);
                const purchasePrice = masterProduct?.purchasePrice ?? 0;
                const stock = (typeof item.purchaseStock === 'number' && !isNaN(item.purchaseStock)) ? item.purchaseStock : 0;
                const value = stock * purchasePrice;
                return daySum + value;
              }, 0) ?? 0;
              
              return {
                date: addDays(fromDate, index),
                totalSalesQuantity: dayTotalSalesQuantity,
                totalPurchaseStock: dayTotalPurchaseStock,
                totalSaleValue: dayTotalSaleValue,
                totalPurchaseValue: dayTotalPurchaseValue,
              };
            });
            setReports(processedReports);
        }

      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to Fetch Data",
          description: errorData.message || `API Error with status: ${response.status}`,
        });
        setReports([]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong. Please try again later.",
      });
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const grandTotalSales = reports.reduce((total, report) => total + ((typeof report.totalSalesQuantity === 'number' && !isNaN(report.totalSalesQuantity)) ? report.totalSalesQuantity : 0), 0);
  const grandTotalPurchases = reports.reduce((total, report) => total + ((typeof report.totalPurchaseStock === 'number' && !isNaN(report.totalPurchaseStock)) ? report.totalPurchaseStock : 0), 0);
  const grandTotalSaleValue = reports.reduce((total, report) => total + ((typeof report.totalSaleValue === 'number' && !isNaN(report.totalSaleValue)) ? report.totalSaleValue : 0), 0);
  const grandTotalPurchaseValue = reports.reduce((total, report) => total + ((typeof report.totalPurchaseValue === 'number' && !isNaN(report.totalPurchaseValue)) ? report.totalPurchaseValue : 0), 0);


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
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3 lg:grid-cols-5">
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
              <Button onClick={handleGetProductMaster} disabled={isFetchingMaster}>
                {isFetchingMaster ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Get Product Master"
                )}
              </Button>
              <Button onClick={handleGetSales} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Get Report"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Purchase Report</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Purchase Stock</TableHead>
                      <TableHead>Total Purchase Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report, index) => (
                        <TableRow key={`${report.date.toISOString()}-${index}-purchases`}>
                          <TableCell>
                            {format(report.date, 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>{(typeof report.totalPurchaseStock === 'number' && !isNaN(report.totalPurchaseStock)) ? report.totalPurchaseStock : '0'}</TableCell>
                          <TableCell>{(typeof report.totalPurchaseValue === 'number' && !isNaN(report.totalPurchaseValue)) ? report.totalPurchaseValue.toFixed(2) : '0.00'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">No purchases to display.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={1} className="text-right font-bold">Grand Total</TableCell>
                      <TableCell className="font-bold">{grandTotalPurchases}</TableCell>
                      <TableCell className="font-bold">{grandTotalPurchaseValue.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sales Report</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Sales Quantity</TableHead>
                      <TableHead>Total Sale Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report, index) => (
                        <TableRow key={`${report.date.toISOString()}-${index}-sales`}>
                          <TableCell>
                            {format(report.date, 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>{(typeof report.totalSalesQuantity === 'number' && !isNaN(report.totalSalesQuantity)) ? report.totalSalesQuantity : '0'}</TableCell>
                          <TableCell>{(typeof report.totalSaleValue === 'number' && !isNaN(report.totalSaleValue)) ? report.totalSaleValue.toFixed(2) : '0.00'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">No sales to display.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-bold">Grand Total</TableCell>
                      <TableCell className="font-bold">{grandTotalSales}</TableCell>
                      <TableCell className="font-bold">{grandTotalSaleValue.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
        </div>

        {productMasterData?.data?.productList && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Product Master</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Sale Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productMasterData.data.productList.length > 0 ? (
                    productMasterData.data.productList.map((product: any) => (
                      <TableRow key={product.SKU}>
                        <TableCell>{product.SKU}</TableCell>
                        <TableCell>{typeof product.purchasePrice === 'number' ? product.purchasePrice.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>{typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No product master data to display.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
