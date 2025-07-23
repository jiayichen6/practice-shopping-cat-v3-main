// 實作寫在這裡！
import axios from "axios"

const productListControl = () => {
  return {
    async getCatLlist() {
      const url = "http://localhost:3002/cats"
      try {
        const resp = await axios.get(url)
        this.$store.catData.productList = resp.data
      } catch (err) {
        console.log(err)
      }
    },

    async addToCart(cat) {
      const cartList = this.$store.catData.cartList
      const index = cartList.findIndex((c) => c.id === cat.id)

      if (index !== -1) {
        cartList[index].count++
      } else {
        cartList.push({ ...cat, count: 1 })
      }

      const url = "http://localhost:3002/cart"

      try {
        if (index !== -1) {
          await axios.patch(`${url}/${cat.id}`, {
            count: cartList[index].count,
          })
        } else {
          await axios.post(url, { ...cat, count: 1 })
        }
      } catch (err) {
        console.log("更新購物車失敗", err)
      }
    },
  }
}

const cartControl = () => {
  return {
    url: "http://localhost:3002/cart",

    async getCartList() {
      try {
        const resp = await axios.get(this.url)
        this.$store.catData.cartList = resp.data
      } catch (err) {
        console.log("購物車讀取失敗：", err)
      }
    },

    calcSubTotal(cat) {
      return Math.round(cat.price * cat.count * 100) / 100
    },

    calcTotal() {
      const total = this.$store.catData.cartList.reduce((acc, item) => {
        return acc + this.calcSubTotal(item)
      }, 0)
      return Math.round(total * 100) / 100
    },

    async changeCount(cat) {
      console.log(cat)

      try {
        const resp = await axios.patch(`${this.url}/${cat.id}`, cat)
        console.log(resp)
      } catch (err) {
        console.log(err)
      }
    },

    async removeProduct(cat) {
      const cartList = this.$store.catData.cartList
      const index = cartList.findIndex((c) => c.id === cat.id)
      cartList.splice(index, 1)

      try {
        await axios.delete(`${this.url}/${cat.id}`)
      } catch (err) {
        console.log("移除商品失敗", err)
      }
    },

    async resetCart() {
      const cartId = this.$store.catData.cartList.map((c) => c.id)
      this.$store.catData.cartList = []

      try {
        for (const id of cartId) {
          await axios.delete(`${this.url}/${id}`)
        }
      } catch (err) {
        console.log("清空購物車失敗", err)
      }
    },
  }
}

export { productListControl, cartControl }
