import { useState } from 'react'
import './App.css'

function App() {
  const [cart, setCart] = useState({})

  const products = [
    { id: 1, name: "Mobile", price: 15000 },
    { id: 2, name: "Fridge", price: 10000 },
    { id: 3, name: "AC", price: 30000 },
    { id: 4, name: "Fan", price: 70000 },
    


    
  ]

  const toggleCart = (productId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart }
      if (newCart[productId]) {
        delete newCart[productId]
      } else {
        newCart[productId] = true
      }
      return newCart
    })
  }

  const totalPrice = products.reduce((sum, product) => {
    return cart[product.id] ? sum + product.price : sum
  }, 0)

  const isInCart = (productId) => cart[productId] || false

  return (
    <div className="app-container">
      <h1>Product List</h1>
      
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                <button
                  className={`action-btn ${isInCart(product.id) ? 'remove' : 'add'}`}
                  onClick={() => toggleCart(product.id)}
                >
                  {isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-section">
        <h2>Total Price: {totalPrice}</h2>
      </div>
    </div>
  )
}

export default App
