import {
	Box,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import cls from './Table.module.scss';
import { MdDeleteOutline, MdMoreHoriz, MdOutlineModeEdit, MdTableChart } from 'react-icons/md';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import Pagination from 'components/Pagination/Pagination';
import { useDeleteMutation, useGetAllDepartmentList } from 'services/department.service';

export default function UTable() {
	const { pathname } = useLocation();
	const [curItems, setCurItems] = useState([]);
	const [dataCount, setDataCount] = useState(0);
	const [itemLimit, setItemLimit] = useState(10);
	const pagesQuantity = Math.ceil(dataCount / itemLimit);
	const [curPage, setCurPage] = useState(1);
	const navigate = useNavigate();

	const { data, refetch } = useGetAllDepartmentList({
		params: {
			limit: itemLimit,
			offset: itemLimit * curPage - itemLimit,
		},
		tableSlug: pathname,
	});

	const handlePageChange = (page) => {
		setCurPage(page);
	};

	useEffect(() => {
		const offset = (curPage - 1) * itemLimit;
		const getList = (curPage, itemLimit) => {
			setDataCount(data?.count);
			setCurItems(data?.[pathname.slice(1)]);
		};
		getList(curPage, itemLimit);
	}, [curPage, itemLimit, data]);

	const { mutate: deleteDepartment } = useDeleteMutation({
		onSuccess: () => {
			refetch();
		},
	});

	const columns = () => {
		switch (pathname) {
		case '/users':
			return (
				<>
					<Th className={cls.table__header}>Имя</Th>
					<Th className={cls.table__header}>Фамилия</Th>
					<Th className={cls.table__header}>Телефон</Th>
				</>
			);
		default:
			return (
				<>
					<Th className={cls.table__header}>Название</Th>
					<Th className={cls.table__header}>Описание</Th>
					<Th></Th>
				</>
			);
		}
	};

	const slug = pathname.slice(0, -1);

	console.log('curIems', curItems);

	return (
		<div className={cls.table}>
			<TableContainer sx={{ border: '1px solid #F4F6FA', margin: '16px' }}>
				<Box overflowY="auto" maxHeight="77vh">
					<Table variant="striped" colorScheme="gray">
						<Thead position="sticky" top={-1} bgColor={'white'}>
							<Tr>
								<Th className={cls.numbers}>№</Th>
								{columns()}
								<Th
									sx={{
										border: '1px solid #F4F6FA',
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<MdTableChart size={27} color="#0e73f0" />
								</Th>
							</Tr>
						</Thead>
						<Tbody className={cls.tBody} style={{ border: '1px solid blue' }}>
							{curItems?.map((el, index) => {
								const mypath = `${pathname}/${el?.id}`;
								const mypathRemove = `${slug}/${el?.id}`;
								return (
									<Tr key={index} className={cls.body__table}>
										<Td>{curPage * 10 - 10 + index + 1}</Td>
										<Td onClick={() => navigate(mypath)}>{el?.name || el?.first_name}</Td>
										<Td className={cls.desc} onClick={() => navigate(mypath)}>
											{el?.description || el?.last_name}
										</Td>
										<Td className={cls.desc} onClick={() => navigate(mypath)}>
											{el?.phone_number}
										</Td>
										<Td className={cls.actions}>
											<Popover>
												<PopoverTrigger>
													<button>
														<div className={cls.action__icon}>
															<MdMoreHoriz size={28} color="#0e73f0" />
														</div>
													</button>
												</PopoverTrigger>
												<PopoverContent>
													<PopoverHeader
														onClick={() => navigate(mypath)}
														sx={{
															display: 'flex',
															alignItems: 'center',
															gap: '12px',
															fontSize: '14px',
															lineHeight: '24px',
															letterSpacing: '0.084px',
															cursor: 'pointer',
														}}
													>
														<Box
															sx={{
																backgroundColor: '#e3effe',
																padding: '8px',
																borderRadius: '6px',
															}}
														>
															<MdOutlineModeEdit color="#4094f7" />
														</Box>
                            Изменить
													</PopoverHeader>
													<PopoverBody
														sx={{
															display: 'flex',
															alignItems: 'center',
															gap: '12px',
															fontSize: '14px',
															lineHeight: '24px',
															letterSpacing: '0.084px',
															cursor: 'pointer',
														}}
														onClick={() => deleteDepartment(mypathRemove)}
													>
														{' '}
														<Box
															sx={{
																backgroundColor: '#fee8e6',
																padding: '8px',
																borderRadius: '6px',
															}}
														>
															<MdDeleteOutline size={19} color="#f76659" />
														</Box>
                            Удалить
													</PopoverBody>
												</PopoverContent>
											</Popover>
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</Box>
			</TableContainer>

			{/* <Pagination
				handlePageChange={handlePageChange}
				pagesQuantity={pagesQuantity}
				setItemLimit={setItemLimit}
				tableBody={curItems}
				curPage={curPage}
			/> */}
		</div>
	);
}
