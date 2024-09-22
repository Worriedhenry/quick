import React from "react";

export default function Cards({ data, priority, ind, user }) {
    return (
        <div className="card">
            <div className="top-card flex justify-between">
                <p className="bold">{data?.id}</p>
                <div class="avatar-container">
                    <div class="avatar">{user.name.substring(0, 2).toUpperCase()}</div>
                    <div style={{ backgroundColor: user.available ? "green" : "gray" }} class="status-indicator"></div>
                </div>
            </div>
            <div className="flex  ">
                {ind != "priority" && <p><img src="public\icons_FEtask\Backlog.svg" alt="" /></p>}
                <p className="truncate-text">{data?.title}.</p>
            </div>
            <div className="flex card-footer ">
                <img src={priority} className="small-border-radius " />
                {data.tag.length > 0 && <p className="small-border-radius">{data?.tag[0]}</p>}
            </div>
        </div>
    )
}
