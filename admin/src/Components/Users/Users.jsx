import React, { useEffect, useState } from "react";
import './Users.css';


const Users = () => {
  const [data, setData] = useState({ users: [], orders: [] });
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
  users: 0,
  orders: 0,
  delivered: 0,
  shipped: 0
});
const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/admin/users")
      .then(res => res.json())
      .then(data => {
        setData(data);
        
        setStats({
          users: data.users.length,
          orders: data.orders.length,
          delivered: data.orders.filter(o => o.status === "Delivered").length,
          shipped: data.orders.filter(o => o.status === "Shipped").length
        });
      });
    }, []);

    const deliverOrder = async (id) => {
      const response = await fetch(`http://localhost:4000/order/status/${id}`, {
        method: "PUT"
      });

  const result = await response.json();

  if (result.success) {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order._id === id
          ? { ...order, status: "Delivered" }
          : order
      )
    }));
  }
};

  return (
  <div className="users-page">
    <div className="users-frame">
      <div className="users-content">
        <h1 className="users-title">Users</h1>

      <input
      className="search-box"
      type="text"
      placeholder="Search user or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ padding: "8px", margin: "10px 0", width: "300px" }}
      />
      <div className="filter-buttons">
        <button
        className={`filter-btn ${filter === "ALL" ? "active-filter" : ""}`}
        onClick={() => setFilter("ALL")}
        >
          All
          </button>
          <button
          className={`filter-btn ${filter === "Shipped" ? "active-filter" : ""}`}
          onClick={() => setFilter("Shipped")}
          >
            Shipped
            </button>
            <button
            className={`filter-btn ${filter === "Delivered" ? "active-filter" : ""}`}
            onClick={() => setFilter("Delivered")}
            >
              Delivered
              </button>
        </div>

      {/* {data.users
      .filter(user =>
        (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase())
      )
      .map(user => ( */}
      {data.users
      .filter(user =>
        (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aMatch = (a.name || "")
        .toLowerCase()
        .startsWith(search.toLowerCase());
        
        const bMatch = (b.name || "")
        .toLowerCase()
        .startsWith(search.toLowerCase());
        
        return bMatch - aMatch;
      })

  .map(user => (
        <div className="user-card" key={user._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          
          <h3 className="user-name">Name: {user.name}</h3>
          <p className="user-info">Email: {user.email}</p>
          <p className="user-info">
            Phone: {
            data.orders.find(order => order.userId === user._id)?.phone || "No Phone"
            }
            </p>
          <p className="user-info">
            Date:{" "}
            {user.date
            ? new Date(user.date).toLocaleDateString()
            : "No Date"}
            </p>


          {data.orders
            .filter(order => order.userId === user._id)
            .filter(order => filter === "ALL" ? true : order.status === filter)
            .map(order => (
              <div className="order-box" key={order._id} style={{ marginLeft: "20px" }}onClick={() => setSelectedOrder(order)}>
                
                <p>Order ID: {order._id}</p>
                <p>
                  Status:{" "}
                  <span
                  className={
                    order.status === "Delivered"? "status-delivered": "status-shipped"
                     }
                     >
                    {order.status}
                    </span>
                    </p>
                    <p>
                      Order Date:{" "}
                      {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "No Date"}
                      </p>

                      {
                      order.deliveredDate && (
                      <p>
                        Delivered On:{" "}
                        {new Date(order.deliveredDate).toLocaleDateString()}
                        </p>
                      )
                      }

                {order.items.map((item, i) => (
                  <div key={i}>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                ))}

                <button className="deliver-btn"
                onClick={() => deliverOrder(order._id)}
                disabled={order.status === "Delivered"}
                >
                  {order.status === "Delivered" ? "Delivered ✅" : "Deliver"}
                  </button>

                <hr />
              </div>
            ))}

        </div>
      ))}
      {selectedOrder && (
        <div className="popup-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)"
        }}
        onClick={() => setSelectedOrder(null)}
        >
    <div className="popup-box"
    style={{
      background: "white",
      padding: "20px",
      width: "400px",
      margin: "100px auto"
    }}
    onClick={(e) => e.stopPropagation()}
    >

      <h2>Order Details</h2>

      <p>Status: {selectedOrder.status}</p>
      <p>Order ID: {selectedOrder._id}</p>

      {selectedOrder.items.map((item, i) => (
        <div key={i}>
          <p>{item.name}</p>
          <p>₹{item.price}</p>
          <p>Qty: {item.quantity}</p>
        </div>
      ))}

      <button className="close-btn" onClick={() => setSelectedOrder(null)}>
        Close
      </button>

    </div>
  </div>
)}
    </div>
    </div>
    </div>
    );
  };

export default Users;