import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import Avatar from '@mui/material/Avatar'

import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/FirebaseConfig"

type Order = 'asc' | 'desc'

interface Colaborador {
    id: string
    nome: string
    email: string
    departamento: string
    status: 'Ativo' | 'Inativo'
}

function compareByKey<T>(a: T, b: T, key: keyof T) {
    const av = a[key]
    const bv = b[key]
    if (typeof av === 'number' && typeof bv === 'number') return av - bv
    return String(av).localeCompare(String(bv), 'pt-BR', { sensitivity: 'base' })
}

function getMultiComparator<T>(order: Order, orderBy: Array<keyof T>) {
    return (a: T, b: T) => {
        for (const key of orderBy) {
            const cmp = compareByKey(a, b, key)
            if (cmp !== 0) return order === 'asc' ? cmp : -cmp
        }
        return 0
    }
}

interface HeadCell {
    id: keyof Colaborador
    label: string
}

const headCells: readonly HeadCell[] = [
    { id: 'nome', label: 'Nome' },
    { id: 'email', label: 'Email' },
    { id: 'departamento', label: 'Departamento' },
    { id: 'status', label: 'Status' },
]

interface EnhancedTableProps {
    order: Order
    orderBy: Array<keyof Colaborador>
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Colaborador) => void
}

function EnhancedTableHead({ order, orderBy, onRequestSort }: EnhancedTableProps) {
    const activeKey = orderBy[0]

    const createSortHandler =
        (property: keyof Colaborador) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property)
        }

    return (
        <TableHead>
            <TableRow
                sx={{
                    '& .MuiTableCell-head': {
                        bgcolor: '#f4f6f8',
                        fontWeight: 600,
                    },
                }}
            >
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="left"
                        sortDirection={activeKey === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={activeKey === headCell.id}
                            direction={activeKey === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            sx={{
                                color: 'inherit',
                                '&.Mui-active': { color: 'inherit' },
                                '& .MuiTableSortLabel-icon': { opacity: 1, color: 'inherit' },
                            }}
                        >
                            {headCell.label}
                            {activeKey === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export default function EnhancedTable() {
    const [rows, setRows] = React.useState<Colaborador[]>([])
    const [order, setOrder] = React.useState<Order>('asc')
    const [orderBy, setOrderBy] = React.useState<Array<keyof Colaborador>>(['nome', 'email'])

    React.useEffect(() => {
        const buscar = async () => {
            const snap = await getDocs(collection(db, "colaboradores"))

            const lista = snap.docs.map((doc) => {
                const dados = doc.data() as any
                return {
                    id: doc.id,
                    nome: dados.nome,
                    email: dados.email,
                    departamento: dados.departamento,
                    status: dados.status,
                } as Colaborador
            })

            setRows(lista)
        }

        buscar()
    }, [])

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Colaborador) => {
        const isPrimary = orderBy[0] === property

        if (isPrimary) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
            return
        }

        setOrderBy((prev) => [property, ...prev.filter((k) => k !== property)])
    }

    const visibleRows = React.useMemo(() => {
        return [...rows].sort(getMultiComparator(order, orderBy))
    }, [rows, order, orderBy])

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} size="medium">
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        <TableBody>
                            {visibleRows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Avatar sx={{ width: 32, height: 32 }}>
                                            {row.nome?.trim()?.[0]?.toUpperCase()}
                                        </Avatar>
                                        {row.nome}
                                    </TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.departamento}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}