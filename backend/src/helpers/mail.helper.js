import { getClient } from '../config/mail.config.js';
import { formatPrice } from '../helpers/Price.js'; 

export const sendEmailReceipt = function (order) {
  const mailClient = getClient();

  const request = mailClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'humiss545@gmail.com', 
          Name: 'Technology Orders'
        },
        To: [
          {
            Email: order.user.email,
            Name: order.name
          }
        ],
        Subject: `Order ${order.id} is being processed`,
        HTMLPart: getReceiptHtml(order)
      }
    ]
  });

  request
    .then(result => {
      console.log(result.body);
    })
    .catch(err => {
      console.error(err); 
    });
};

const getReceiptHtml = function (order) {
  const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
  console.log("Order details: ", order)
  const totalAfterDiscount = order.totalPrice - order.discount;

  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
          background-color: #f9f9f9;
        }
        .container {
          background-color: #fff;
          padding: 20px;
          max-width: 600px;
          margin: auto;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .banner img {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          border-radius: 8px;
        }
        h1 {
          color: #4CAF50;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
        }
        th, td {
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        tfoot td {
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 0.9em;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="banner">
          <img
            src="https://www.crowe.com/-/media/crowe/llp/sc10-media/insights/articles/2023/content-2000x1125/contentmktmt2300002bfy23-markets-technology-awareness--whats-next-for-tech--thought-leadershipas3639.jpg?rev=025a044aa9394515a261e9c6242045cb"
            alt="Order Confirmation"
          />
        </div>

        <h1>Order Payment Confirmation</h1>
        <p>Dear <strong>${order.name}</strong>,</p>
        <p>Thank you for shopping with us! Your order has been <strong>successfully paid</strong> and is now being processed.</p>

        <p><strong>Tracking ID:</strong> ${order.id}</p>
        <p><strong>Order Date:</strong> ${orderDate.toISOString().replace('T', ' ').substring(0, 16)}</p>

        <h2>Order Details</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>${formatPrice(item.product.price)}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total</td>
              <td>${formatPrice(order.totalPrice)}</td>
            </tr>
            <tr>
              <td colspan="3">Discount</td>
              <td>-${formatPrice(order.discount)}</td>
            </tr>
            <tr>
              <td colspan="3">Total After Discount</td>
              <td>${formatPrice(totalAfterDiscount)}</td>
            </tr>
          </tfoot>
        </table>

        <p><strong>Shipping Address:</strong> ${order.address}</p>

        <div class="footer">
          <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
          <p>&copy; ${new Date().getFullYear()} Technology Orders</p>
        </div>
      </div>
    </body>
  </html>
  `;
};