import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useGetPurchasedCoursesQuery } from "@/features/api/paymentAPi.js";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Calendar, 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  RefreshCw,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("all");
  
  const { data, isSuccess, isError, isLoading, refetch } = useGetPurchasedCoursesQuery();
  
  // Calculate metrics
  const { totalRevenue, totalSales, courseData, avgPrice, topCourse, categoryData, monthlyData } = useMemo(() => {
    if (!isSuccess || !data?.purchasedCourse) {
      return {
        totalRevenue: 0,
        totalSales: 0,
        courseData: [],
        avgPrice: 0,
        topCourse: null,
        categoryData: [],
        monthlyData: []
      };
    }
    
    const purchasedCourse = data.purchasedCourse || [];
    
    // Course data for charts
    const courseData = purchasedCourse.map((course) => ({
      name: course.courseId.courseTitle,
      price: course.courseId.coursePrice,
      date: new Date(course.createdAt || Date.now())
    }));
    
    // Calculate total revenue and sales
    const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
    const totalSales = purchasedCourse.length;
    
    // Calculate average price
    const avgPrice = totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : 0;
    
    // Find top selling course
    const courseCounts = {};
    purchasedCourse.forEach(course => {
      const title = course.courseId.courseTitle;
      courseCounts[title] = (courseCounts[title] || 0) + 1;
    });
    
    let topCourseName = "";
    let topCourseCount = 0;
    
    Object.entries(courseCounts).forEach(([name, count]) => {
      if (count > topCourseCount) {
        topCourseName = name;
        topCourseCount = count;
      }
    });
    
    const topCourse = {
      name: topCourseName,
      count: topCourseCount
    };
    
    // Category data for pie chart
    const categories = {};
    purchasedCourse.forEach(course => {
      const category = course.courseId.category || "Uncategorized";
      if (!categories[category]) {
        categories[category] = {
          name: category,
          value: 0
        };
      }
      categories[category].value += course.amount || 0;
    });
    
    const categoryData = Object.values(categories);
    
    // Monthly data for trend analysis
    const months = {};
    purchasedCourse.forEach(course => {
      const date = new Date(course.createdAt || Date.now());
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = {
          name: monthYear,
          revenue: 0,
          sales: 0
        };
      }
      
      months[monthYear].revenue += course.amount || 0;
      months[monthYear].sales += 1;
    });
    
    // Convert to array and sort by date
    const monthlyData = Object.values(months).sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA - dateB;
    });
    
    return {
      totalRevenue,
      totalSales,
      courseData,
      avgPrice,
      topCourse,
      categoryData,
      monthlyData
    };
  }, [data, isSuccess]);
  
  // Define chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Filter data based on time range
  const filteredCourseData = useMemo(() => {
    if (timeRange === "all") return courseData;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return courseData;
    }
    
    return courseData.filter(item => item.date >= cutoffDate);
  }, [courseData, timeRange]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading dashboard data...</h2>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Failed to load dashboard data</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">There was an error retrieving your sales data. Please try again.</p>
        <button 
          onClick={() => refetch()} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Sales Dashboard</h1>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
          </select>
          <button 
            onClick={() => refetch()} 
            className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalSales}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">courses sold</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">earned from courses</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Price</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">₹{avgPrice}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">average per course</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Course</CardTitle>
            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400 truncate" title={topCourse?.name || "N/A"}>
              {topCourse?.name || "N/A"}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {topCourse?.count || 0} sales
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Card className="shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Sales Analytics
            </CardTitle>
            <Tabs defaultValue="line" className="mt-3 sm:mt-0" onValueChange={setChartType}>
              <TabsList className="bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="line" className="flex items-center">
                  <LineChartIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Line</span>
                </TabsTrigger>
                <TabsTrigger value="bar" className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Bar</span>
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex items-center">
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Pie</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {timeRange === "all" ? "All time" : timeRange === "week" ? "Past 7 days" : timeRange === "month" ? "Past month" : "Past 3 months"} sales data
          </CardDescription>
          <Separator className="my-2" />
        </CardHeader>
        <CardContent>
          {filteredCourseData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-3">
                <BarChart2 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No data available</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                There are no sales for the selected time period. Try changing the time range or check back later.
              </p>
            </div>
          ) : (
            <>
              {chartType === "line" && (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={filteredCourseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      angle={-30}
                      textAnchor="end"
                      height={70}
                      tick={{fontSize: 12}}
                      interval={0}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value, name) => [`₹${value}`, 'Price']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      name="Course Price"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              
              {chartType === "bar" && (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={filteredCourseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      angle={-30}
                      textAnchor="end"
                      height={70}
                      tick={{fontSize: 12}}
                      interval={0}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value, name) => [`₹${value}`, 'Price']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="price" 
                      name="Course Price" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {chartType === "pie" && (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Category Revenue Distribution
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Monthly Trends */}
      <Card className="shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Monthly Trends
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Revenue and sales performance over time
          </CardDescription>
          <Separator className="my-2" />
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No monthly data available</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                There is not enough historical data to display monthly trends.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  tick={{fontSize: 12}}
                />
                <YAxis 
                  yAxisId="left" 
                  stroke="#6b7280" 
                  orientation="left"
                  domain={[0, 'auto']}
                />
                <YAxis 
                  yAxisId="right" 
                  stroke="#6b7280" 
                  orientation="right"
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "Revenue" ? `₹${value}` : value,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;