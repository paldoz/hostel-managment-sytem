import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateStudentReport = (students: any[]) => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text('Student Report', 14, 22)

    // Date
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

    // Table
    const tableData = students.map(s => [
        s.id,
        s.name,
        s.phone,
        s.room,
        s.feeStatus,
        s.joinDate
    ])

    autoTable(doc, {
        head: [['ID', 'Name', 'Phone', 'Room', 'Fee Status', 'Join Date']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234] }
    })

    doc.save('student-report.pdf')
}

export const generateFeeReport = (students: any[]) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Fee Collection Report', 14, 22)

    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

    const paid = students.filter(s => s.feeStatus === 'paid').length
    const unpaid = students.filter(s => s.feeStatus === 'unpaid').length

    // Summary
    doc.setFontSize(12)
    doc.text(`Total Students: ${students.length}`, 14, 45)
    doc.text(`Paid: ${paid}`, 14, 52)
    doc.text(`Unpaid: ${unpaid}`, 14, 59)

    // Table
    const tableData = students.map(s => [
        s.id,
        s.name,
        s.room,
        s.feeStatus
    ])

    autoTable(doc, {
        head: [['ID', 'Name', 'Room', 'Status']],
        body: tableData,
        startY: 75,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234] }
    })

    doc.save('fee-report.pdf')
}

export const generateComplaintReport = (complaints: any[]) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Complaint Report', 14, 22)

    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

    const resolved = complaints.filter(c => c.status === 'resolved').length
    const other = complaints.length - resolved

    doc.setFontSize(12)
    doc.text(`Total Complaints: ${complaints.length}`, 14, 45)
    doc.text(`Active (Open/In-Progress): ${other}`, 14, 52)
    doc.text(`Resolved: ${resolved}`, 14, 59)

    const tableData = complaints.map(c => [
        c.id,
        c.studentName,
        c.category,
        c.status,
        c.date
    ])

    autoTable(doc, {
        head: [['ID', 'Student', 'Category', 'Status', 'Date']],
        body: tableData,
        startY: 70,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234] }
    })

    doc.save('complaint-report.pdf')
}

export const generateMonthlyReport = (students: any[], rooms: any[], complaints: any[]) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Monthly Summary Report', 14, 22)

    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

    // Statistics
    doc.setFontSize(14)
    doc.text('Overview', 14, 45)

    doc.setFontSize(12)
    doc.text(`Total Students: ${students.length}`, 14, 55)
    doc.text(`Total Rooms: ${rooms.length}`, 14, 62)
    doc.text(`Paid Fees: ${students.filter(s => s.feeStatus === 'paid').length}`, 14, 69)
    doc.text(`Active Complaints: ${complaints.filter(c => c.status !== 'resolved').length}`, 14, 76)

    doc.save('monthly-report.pdf')
}
