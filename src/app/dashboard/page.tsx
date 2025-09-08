
"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const stores = [
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

export default function DashboardPage() {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <CardTitle>All Expenses List</CardTitle>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="space-y-4">
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
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2" /> Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-semibold">Expense Detail</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button>Add New</Button>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.name}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button>Get Details</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Total Amount</CardTitle>
                <CardDescription>₹ 0.00</CardDescription>
            </CardHeader>
            <CardContent>
                <Button>Add Account</Button>
            </CardContent>
          </Card>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
