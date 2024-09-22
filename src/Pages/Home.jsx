import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Columns from "../Components/columns";
import Header from "../Components/header";

export default function Home() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const { search } = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(search);
    const validDisplays = ["status", "priority", "user"];


    const display = validDisplays.includes(queryParams.get("display")) ? queryParams.get("display") : "status";
    const sort = queryParams.get("sort") || "priority";


    const statusOrder = ["Backlog", "Todo", "In progress", "Done", "Cancelled"];

    const priorityLabels = {
        4: "Urgent",
        3: "High",
        2: "Medium",
        1: "Low",
        0: "No priority",
    };

    const preprocessGroupedTickets = (groupedTickets, display) => {
        if (display === "status") {
            const orderedGroupedTickets = {};
            statusOrder.forEach((status) => {
                if (groupedTickets[status]) {
                    orderedGroupedTickets[status] = groupedTickets[status];
                } else {
                    orderedGroupedTickets[status] = [];
                }
            });
            return orderedGroupedTickets;
        } else if (display === "priority") {
            const orderedGroupedByPriority = {};
            Object.keys(groupedTickets).forEach((key) => {
                const priorityLevel = parseInt(key);
                const priorityLabel = priorityLabels[priorityLevel];
                if (priorityLabel) {
                    orderedGroupedByPriority[priorityLabel] = groupedTickets[key];
                }
            });
            return orderedGroupedByPriority;
        }
        return groupedTickets;
    };

    const groupTickets = (tickets) => {
        const sortedTickets = sortTickets(tickets);
        let groupedTickets;

        if (display === "status") {
            groupedTickets = groupBy(sortedTickets, "status");
        } else if (display === "user") {
            const userLookup = users.reduce((acc, user) => {
                acc[user.id] = user.name;
                return acc;
            }, {});

            groupedTickets = groupBy(sortedTickets, "userId");

            Object.keys(groupedTickets).forEach((userId) => {
                if (userLookup[userId]) {
                    groupedTickets[userLookup[userId]] = groupedTickets[userId];
                    delete groupedTickets[userId];
                }
            });
        } else if (display === "priority") {
            groupedTickets = groupBy(sortedTickets, "priority");
        }

        return preprocessGroupedTickets(groupedTickets, display);
    };

    const groupBy = (items, key) => {
        return items.reduce((acc, item) => {
            const groupKey = item[key];
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(item);
            return acc;
        }, {});
    };

    const sortTickets = (tickets) => {
        if (sort === "priority") {
            return tickets.sort((a, b) => b.priority - a.priority);
        } else if (sort === "title") {
            return tickets.sort((a, b) => a.title.localeCompare(b.title));
        }
        return tickets;
    };


    const groupedTickets = groupTickets(tickets);

    
    useEffect(() => {
        axios
            .get("https://api.quicksell.co/v1/internal/frontend-assignment")
            .then((response) => {
                setTickets(response.data.tickets);
                setUsers(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        const displayParam = queryParams.get("display");
        const sortParam = queryParams.get("sort");

        const defaultDisplay = validDisplays.includes(displayParam) ? displayParam : "status";
        const defaultSort = sortParam || "priority";

        if (!displayParam || !validDisplays.includes(displayParam) || !sortParam) {
            navigate(`?display=${defaultDisplay}&sort=${defaultSort}`, { replace: true });
        }
    }, [search, navigate, queryParams]);

    return (
        <div style={{ padding: "0px" }} className="cg-5 container">
            <Header />
            <div className="flex container responsive-columns">
                {Object.keys(groupedTickets).map((key) => (
                    <Columns key={key} ind={key} user={users} ticket={groupedTickets[key]} />
                ))}
            </div>
        </div>
    );
}
