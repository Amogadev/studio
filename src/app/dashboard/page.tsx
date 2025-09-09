
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
import { Calendar as CalendarIcon, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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

interface Expense {
  storeName: string;
  date: string;
  amount: number;
}

interface Sale {
  invoiceNumber: string;
  timeCreatedAt: number;
  _id: string;
}

interface Store {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();
  const [selectedStore, setSelectedStore] = React.useState<string>("");
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const [isAddExpenseOpen, setAddExpenseOpen] = React.useState(false);
  const [newExpenseStore, setNewExpenseStore] = React.useState<string>("");
  const [newExpenseDate, setNewExpenseDate] = React.useState<Date | undefined>();
  const [newExpenseAmount, setNewExpenseAmount] = React.useState<string>("");

  const [isAddAccountOpen, setAddAccountOpen] = React.useState(false);
  const [newAccountId, setNewAccountId] = React.useState("");
  const [newAccountName, setNewAccountName] = React.useState("");
  const [stores, setStores] = React.useState<Store[]>(initialStores);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("expenses");


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
  
  const handleGetExpenses = async () => {
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
      const queryParams = new URLSearchParams({
        club: selectedStore,
        from: format(fromDate, "yyyy-MM-dd"),
        to: format(toDate, "yyyy-MM-dd"),
      });

      const response = await fetch(`https://tnfl2-cb6ea45c64b3.herokuapp.com/services/admin/expenses/get?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const expensesData = (data.data || []).map((e: any) => ({...e, storeName: stores.find(s => s.id === selectedStore)?.name || ''}));
        setExpenses(expensesData);
        
        const total = expensesData.reduce((acc: number, expense: Expense) => acc + expense.amount, 0);
        setTotalAmount(total);

        if (expensesData.length === 0) {
          toast({
            title: "No Expenses Found",
            description: "No expenses were found for the selected criteria.",
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to Fetch Expenses",
          description: errorData.message || "An error occurred while fetching data.",
        });
        setExpenses([]);
        setTotalAmount(0);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong. Please try again later.",
      });
      setExpenses([]);
      setTotalAmount(0);
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
        setSales(salesData);

        if (salesData.length === 0) {
          toast({
            title: "No Sales Found",
            description: "No sales were found for the selected criteria.",
          });
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
  
  const handleGetData = () => {
    if (activeTab === 'expenses') {
      handleGetExpenses();
    } else {
      handleGetSales();
    }
  };

  const handleAddExpense = async () => {
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
    
    if (!newExpenseStore || !newExpenseDate || !newExpenseAmount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields for the new expense.",
      });
      return;
    }

    try {
      const response = await fetch('https://tnfl2-cb6ea45c64b3.herokuapp.com/services/admin/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          club: newExpenseStore,
          date: format(newExpenseDate, 'yyyy-MM-dd'),
          amount: parseFloat(newExpenseAmount),
        }),
      });

      if (response.ok) {
        toast({
          title: "Expense Added",
          description: "The new expense has been successfully added.",
        });
        setAddExpenseOpen(false);
        // Reset form
        setNewExpenseStore("");
        setNewExpenseDate(undefined);
        setNewExpenseAmount("");
        // Optionally, refresh the expenses list
        if (selectedStore && fromDate && toDate && activeTab === 'expenses') {
          handleGetExpenses();
        }
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to Add Expense",
          description: errorData.message || "An error occurred while adding the expense.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleAddAccount = async () => {
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
    
    if (!newAccountId || !newAccountName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both an ID and a name for the new account.",
      });
      return;
    }

    // In a real app, you would make an API call here to save the new account.
    // For now, we'll just add it to the local state.
    const newStore: Store = {
      id: newAccountId,
      name: newAccountName,
    };
    setStores([...stores, newStore].sort((a, b) => a.name.localeCompare(b.name)));
    
    toast({
      title: "Account Added",
      description: `The account "${newAccountName}" has been added.`,
    });
    
    setAddAccountOpen(false);
    setNewAccountId("");
    setNewAccountName("");
  };

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-xl font-semibold">WELCOME</h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => setAddExpenseOpen(true)}>Add New Expense</Button>
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
              <Button onClick={handleGetData}>Get {activeTab === 'expenses' ? 'Expenses' : 'Sales'}</Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>
          <TabsContent value="expenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-end">
                 <Button onClick={() => setAddAccountOpen(true)}>Add Account</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Store Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length > 0 ? (
                      expenses.map((expense, index) => (
                        <TableRow key={index}>
                          <TableCell>{expense.storeName}</TableCell>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell className="text-right">₹ {expense.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">No expenses to display.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="text-lg font-semibold">Total Amount</TableCell>
                      <TableCell className="text-right text-lg font-semibold">₹ {totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sales">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.length > 0 ? (
                      sales.map((sale) => (
                        <TableRow key={sale._id}>
                          <TableCell>{sale.invoiceNumber}</TableCell>
                          <TableCell>{format(new Date(sale.timeCreatedAt * 1000), 'dd/MM/yyyy')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">No sales to display.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isAddExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="store" className="text-right">
                Store
              </Label>
              <div className="col-span-3">
                <Select value={newExpenseStore} onValueChange={setNewExpenseStore}>
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newExpenseDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newExpenseDate ? (
                          format(newExpenseDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newExpenseDate}
                        onSelect={setNewExpenseDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                className="col-span-3"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddAccountOpen} onOpenChange={setAddAccountOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountId" className="text-right">
                Account ID
              </Label>
              <Input
                id="accountId"
                value={newAccountId}
                onChange={(e) => setNewAccountId(e.target.value)}
                className="col-span-3"
                placeholder="Enter account ID"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountName" className="text-right">
                Account Name
              </Label>
              <Input
                id="accountName"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="col-span-3"
                placeholder="Enter account name"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

    