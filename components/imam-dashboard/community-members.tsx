"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MoreHorizontal,
  Mail,
  UserPlus,
  UserX,
  UserCheck,
  Filter,
} from "lucide-react";
import { getMasjidFollowers } from "@/app/(dashboards)/imam/community/action";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { set } from "date-fns";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "pending" | "inactive";
  role: "member" | "volunteer" | "committee" | "admin";
  image?: string;
};

export function CommunityMembers() {
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          toast.error("Authentication required");
          return;
        }
        const result = await getMasjidFollowers(token);
        if (!result.success) {
          toast.error(result.message || "Failed to fetch members");
          return;
        }

        if (!result.data || result.data.length === 0) {
          toast.info("No members found");
          setMembers([]);
          return;
        }

        console.log(result);

        // Transform data to match Member type if necessary
        const fetchedMembers: Member[] = result.data.map((follower: any) => ({
          id: follower.id,
          name: follower.name,
          email: follower.email,
          phone: follower.phone,
          joinDate: follower.joinDate,
          status: follower.status,
          role: follower.role,
          image: follower.image,
        }));
        setMembers(fetchedMembers);
      } catch (error) {
        toast.error("Failed to fetch members");
      }

      //  consr result = await getMasjidFollowers()
    };

    fetchMembers();
  }, []);

  console.log("Members:", member);

  // Mock members data
  const members: Member[] = [
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "(555) 123-4567",
      joinDate: "2022-05-15",
      status: "active",
      role: "member",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Fatima Ali",
      email: "fatima@example.com",
      phone: "(555) 234-5678",
      joinDate: "2022-06-20",
      status: "active",
      role: "volunteer",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Omar Rahman",
      email: "omar@example.com",
      phone: "(555) 345-6789",
      joinDate: "2022-07-10",
      status: "active",
      role: "committee",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Aisha Malik",
      email: "aisha@example.com",
      phone: "(555) 456-7890",
      joinDate: "2022-08-05",
      status: "pending",
      role: "member",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      name: "Yusuf Ibrahim",
      email: "yusuf@example.com",
      phone: "(555) 567-8901",
      joinDate: "2022-09-15",
      status: "inactive",
      role: "member",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "6",
      name: "Zainab Hassan",
      email: "zainab@example.com",
      phone: "(555) 678-9012",
      joinDate: "2022-10-20",
      status: "active",
      role: "admin",
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "7",
      name: "Khalid Mahmood",
      email: "khalid@example.com",
      phone: "(555) 789-0123",
      joinDate: "2022-11-10",
      status: "active",
      role: "volunteer",
      image: "/placeholder.svg?height=32&width=32",
    },
  ];

  // Filter members based on search query and status filter
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    const matchesStatus = statusFilter ? member.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "committee":
        return "bg-blue-100 text-blue-800";
      case "volunteer":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Community Members</CardTitle>
        <CardDescription>
          Manage your masjid&apos;s community members and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or phone..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter
                    ? `Status: ${statusFilter}`
                    : "Filter by Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{member.email}</div>
                        <div className="text-muted-foreground">
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(member.joinDate)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status.charAt(0).toUpperCase() +
                          member.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getRoleColor(member.role)}
                      >
                        {member.role.charAt(0).toUpperCase() +
                          member.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            {member.status === "pending" && (
                              <DropdownMenuItem className="flex items-center">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {member.status === "active" ? (
                              <DropdownMenuItem className="flex items-center text-destructive">
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="flex items-center">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">{filteredMembers.length}</span> of{" "}
            <span className="font-medium">{members.length}</span> members
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
