import React, { useState } from "react";
import Cards from "./cards";
import { useLocation, useNavigate } from "react-router-dom";

export default function Columns({ user, ticket, ind }) {
    const { search } = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(search);
    const display = queryParams.get("display") || "status";
    const validDisplays = ["status", "priority", "user"];
    if (validDisplays.includes(display) === false) {
        navigate(`?display=${validDisplays[0]}}`, { replace: true });
    }
    const userMap = {}
    user.forEach(element => {
        userMap[element.id] = element
    })

    const logos = {
        "No priority": `icons_FEtask/No-priority.svg`,
        "Low": "icons_FEtask\\Img - Low Priority.svg",
        "Medium": "icons_FEtask\\Img - Medium Priority.svg",
        "High": "icons_FEtask\\Img - High Priority.svg",
        "Urgent": "icons_FEtask/SVG - Urgent Priority colour.svg",
        0: `icons_FEtask\\No-priority.svg`,
        1: "icons_FEtask\\Img - Low Priority.svg",
        2: "icons_FEtask\\Img - Medium Priority.svg",
        3: "icons_FEtask\\Img - High Priority.svg",
        4: "icons_FEtask\\SVG - Urgent Priority grey.svg",
        "Backlog": "icons_FEtask\\Backlog.svg",
        "Todo": "icons_FEtask\\To-do.svg",
        "In progress": "icons_FEtask\\in-progress.svg",
        "Done": "icons_FEtask\\Done.svg",
        "Cancelled": "icons_FEtask\\Cancelled.svg",
    }

    return (
        <div className="column-container flex flex-col rg-10 ">
            <div className="column-header flex justify-between">
                <div className="flex cg-5">
                    {logos[ind] ? <img src={logos[ind]} alt="" />
                        : <div class="avatar-container">
                            <div class="avatar">{ind.substring(0, 2).toUpperCase()}</div>
                            <div style={{ backgroundColor: user.available ? "green" : "gray" }} class="status-indicator"></div>
                        </div>
                    }
                    <p className="truncate-text-1" style={{ maxWidth: "10ch" }}>{ind}</p>
                    <p className="ticket-count">{ticket.length}</p>
                </div>
                <div className="flex cg-5">
                    <img src="icons_FEtask\add.svg" alt="" />
                    <img src="icons_FEtask\3 dot menu.svg" alt="" />
                </div>
            </div>
            {ticket.map((data) => (
                <Cards data={data} priority={logos[data.priority]} ind={display} user={userMap[data.userId]} />
            ))}
            {ticket.length === 0 && <p className="no-tickets bold">No tickets found</p>}
        </div>
    )
}  