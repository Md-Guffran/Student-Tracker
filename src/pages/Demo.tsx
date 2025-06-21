import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, BookOpen, CheckCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { useState } from "react";

const demoExpenses = [
	{ id: 1, description: "Books & Supplies", category: "Education", amount: 1200, date: "2025-06-01" },
	{ id: 2, description: "Coffee", category: "Food", amount: 150, date: "2025-06-02" },
	{ id: 3, description: "Bus Pass", category: "Transport", amount: 500, date: "2025-06-03" },
];

const demoTodos = [
	{ id: 1, task: "Finish Math Assignment", due_time: "Today 5pm", priority: "high", status: "pending" },
	{ id: 2, task: "Read Chapter 4", due_time: "Tomorrow", priority: "medium", status: "completed" },
	{ id: 3, task: "Group Project Meeting", due_time: "Friday", priority: "high", status: "pending" },
];

const demoStudySessions = [
	{ id: 1, subject: "Physics", hours: 2, date: "2025-06-01" },
	{ id: 2, subject: "History", hours: 1.5, date: "2025-06-02" },
	{ id: 3, subject: "Mathematics", hours: 3, date: "2025-06-03" },
];

// Pie chart data for expenses by category
const expenseData = [
	{ name: "Education", value: 1200, color: "#6366f1" },
	{ name: "Food", value: 150, color: "#22d3ee" },
	{ name: "Transport", value: 500, color: "#f59e42" },
];

// Bar chart data for study hours by subject
const studyData = [
	{ subject: "Physics", hours: 2 },
	{ subject: "History", hours: 1.5 },
	{ subject: "Mathematics", hours: 3 },
];

const Demo = () => {
	const [todos, setTodos] = useState(demoTodos);

	// For demo, allow toggling completed status visually
	const toggleTodo = (id: number) => {
		setTodos(todos =>
			todos.map(todo =>
				todo.id === id
					? { ...todo, status: todo.status === "completed" ? "pending" : "completed" }
					: todo
			)
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
			<div className="container mx-auto px-4">
				<div className="mb-10 text-center">
					<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Demo: See Student Tracker in Action
					</h1>
					<p className="text-lg text-gray-600 mb-6">
						Explore how you can manage your expenses, study hours, and tasks all in one place.
					</p>
					<Link to="/signup">
						<Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg px-8 py-4">
							Try it Yourself
						</Button>
					</Link>
				</div>

				{/* Expenses Demo with Pie Chart */}
				<Card className="mb-8 border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="w-6 h-6 text-green-500" />
							Expense Tracker
						</CardTitle>
						<CardDescription>Track your spending and see where your money goes.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col md:flex-row gap-8 items-center">
							<div className="w-full md:w-1/2 h-64">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={expenseData}
											cx="50%"
											cy="50%"
											innerRadius={50}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{expenseData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
									</PieChart>
								</ResponsiveContainer>
								<div className="flex flex-wrap gap-2 mt-4 justify-center">
									{expenseData.map((item, index) => (
										<Badge key={index} variant="outline" className="flex items-center space-x-1">
											<div
												className="w-2 h-2 rounded-full"
												style={{ backgroundColor: item.color }}
											/>
											<span>{item.name}: ₹{item.value}</span>
										</Badge>
									))}
								</div>
							</div>
							<div className="w-full md:w-1/2 space-y-3">
								{demoExpenses.map(exp => (
									<div key={exp.id} className="flex items-center justify-between bg-green-50 rounded-lg px-4 py-2">
										<div>
											<div className="font-medium">{exp.description}</div>
											<div className="text-xs text-gray-500">{exp.category} • {new Date(exp.date).toLocaleDateString()}</div>
										</div>
										<div className="font-bold text-green-700">-₹{exp.amount}</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Study Hours Demo with Bar Chart */}
				<Card className="mb-8 border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="w-6 h-6 text-blue-500" />
							Study Hours
						</CardTitle>
						<CardDescription>Log your study sessions and keep track of your progress.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col md:flex-row gap-8 items-center">
							<div className="w-full md:w-1/2 h-64">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={studyData}>
										<XAxis dataKey="subject" />
										<YAxis />
										<Tooltip formatter={(value) => [`${value} hours`, "Study Time"]} />
										<Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>
							<div className="w-full md:w-1/2 space-y-3">
								{demoStudySessions.map(session => (
									<div key={session.id} className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2">
										<div>
											<div className="font-medium">{session.subject}</div>
											<div className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</div>
										</div>
										<div className="font-bold text-blue-700">{session.hours}h</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Todo List Demo with Tick Boxes */}
				<Card className="mb-8 border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="w-6 h-6 text-purple-500" />
							To-Do List
						</CardTitle>
						<CardDescription>Stay organized and never miss a deadline.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{todos.map(todo => (
								<div key={todo.id} className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-2">
									<div className="flex items-center gap-3">
										<input
											type="checkbox"
											checked={todo.status === "completed"}
											onChange={() => toggleTodo(todo.id)}
											className="w-5 h-5 accent-purple-500"
											aria-label="Mark as completed"
										/>
										<div>
											<div className={`font-medium ${todo.status === "completed" ? "line-through text-gray-400" : ""}`}>
												{todo.task}
											</div>
											<div className="text-xs text-gray-500">{todo.due_time}</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant={
											todo.priority === "high" ? "destructive" :
											todo.priority === "medium" ? "default" : "secondary"
										}>
											{todo.priority}
										</Badge>
										{todo.status === "completed" && (
											<CheckCircle className="w-4 h-4 text-green-500" />
										)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<div className="text-center mt-12">
					<Link to="/signup">
						<Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg px-8 py-4">
							Get Started for Free
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Demo;