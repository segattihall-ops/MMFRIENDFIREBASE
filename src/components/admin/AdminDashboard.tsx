
"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, CreditCard, Activity, CheckCircle, XCircle } from "lucide-react";
import type { User } from '@/lib/types';


const mockUsers: User[] = [
    { id: 'user1', email: 'john.doe@example.com', tier: 'gold', status: 'active', revenue: 490 },
    { id: 'user2', email: 'jane.smith@example.com', tier: 'platinum', status: 'active', revenue: 990 },
    { id: 'user3', email: 'sam.wilson@example.com', tier: 'gold', status: 'canceled', revenue: 245 },
    { id: 'user4', email: 'lisa.white@example.com', tier: 'platinum', status: 'active', revenue: 1980 },
    { id: 'user5', email: 'mark.brown@example.com', tier: 'gold', status: 'active', revenue: 490 },
];

const AdminDashboard = () => {
    const totalUsers = mockUsers.length;
    const activeSubscriptions = mockUsers.filter(u => u.status === 'active').length;
    const totalRevenue = mockUsers.reduce((acc, user) => acc + user.revenue, 0);

    // Mock API status
    const apiStatus = {
        'MasseurPro API': 'operational',
        'Google Trends API': 'operational',
        'Stripe API': 'degraded',
        'Genkit AI': 'operational',
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All-time gross volume</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{activeSubscriptions}</div>
                        <p className="text-xs text-muted-foreground">Gold & Platinum</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">All registered users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">API Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">All Systems Go</div>
                        <p className="text-xs text-muted-foreground">As of last check</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Management Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>An overview of all registered users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Tier</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.tier === 'platinum' ? 'default' : 'secondary'} className="capitalize">{user.tier}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} className="capitalize border-current">{user.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">${user.revenue.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* API Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Real-time API Status</CardTitle>
                         <CardDescription>Live monitoring of critical services.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(apiStatus).map(([api, status]) => (
                            <div key={api} className="flex items-center justify-between">
                                <span className="text-sm font-medium">{api}</span>
                                <div className="flex items-center gap-2">
                                     {status === 'operational' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
                                    <span className={`text-sm font-semibold capitalize ${status === 'operational' ? 'text-green-500' : 'text-destructive'}`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
