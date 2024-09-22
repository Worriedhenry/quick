import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function Header() {
    const [grouping, setGrouping] = useState('Status');
    const [sorting, setSorting] = useState('Priority');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const updateURL = (newGrouping, newSorting) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('display', newGrouping);
        searchParams.set('sort', newSorting);
        navigate({
            pathname: location.pathname,
            search: searchParams.toString(),
        });
    };

    const handleSortingChange = (event) => {
        const newSorting = event.target.value;
        setSorting(newSorting);
        updateURL(grouping, newSorting);
    };

    const handleGroupingChange = (event) => {
        const newGrouping = event.target.value;
        setGrouping(newGrouping);
        updateURL(newGrouping, sorting);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlGrouping = searchParams.get('display');
        const urlSorting = searchParams.get('sort');

        if (urlGrouping) setGrouping(urlGrouping);
        if (urlSorting) setSorting(urlSorting);
    }, [location.search]);

    return (
        <div className="header">
            <div className="display">
                <button className="dis-button" onClick={toggleDropdown}>
                    <img src='icons_FEtask/Display.svg' alt="display" />
                    <p className="dis-button-text">Display</p>
                    <img className="down" src='icons_FEtask/down.svg' alt="down" />
                </button>

                {dropdownVisible && (
                    <div className="dropdown" style={{ position: 'absolute', top: '100%', left: '0' }}>
                        <div className="dropdown-group">
                            <label className="bold" htmlFor="grouping">Grouping</label>
                            <select  id="grouping" value={grouping} onChange={handleGroupingChange}>
                                <option value="status">Status</option>
                                <option value="user">User</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                        <div className="dropdown-group">
                            <label className="bold" htmlFor="sorting">Ordering</label>
                            <select  id="sorting" value={sorting} onChange={handleSortingChange}>
                                <option value="priority">Priority</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;