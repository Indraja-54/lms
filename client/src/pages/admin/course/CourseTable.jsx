import { Button } from '@/components/ui/button';
import React from 'react';
import { useGetCreatorCourseQuery } from "@/features/api/courseApi.js"
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    totalAmount: '$1,200.00',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    paymentMethod: 'PayPal',
    totalAmount: '$800.00',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Failed',
    paymentMethod: 'Bank Transfer',
    totalAmount: '$500.00',
  },
];

const CourseTable = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useGetCreatorCourseQuery()

  if (isLoading) return <h1>Loading..</h1>
  console.log(data)
  return (
    <div className="">
      <Button onClick={() => {
        navigate('create')
      }}>Create a new course</Button>
      <Table>
        <TableCaption>A list of recent Courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
              <TableCell>
                <Badge>{course.isPublished ? "Published" : "Draft"}</Badge>
              </TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={()=>{
                  navigate(`${course._id}`)
                }}>
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
  )
}

export default CourseTable;
