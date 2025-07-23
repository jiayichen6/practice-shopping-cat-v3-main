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
        const data = (await axios.get(url)).data
        const existed = data.findIndex((c) => c.id === cat.id)

        if (existed !== -1) {
          data[existed].count++
          axios.patch(`${url}/${cat.id}`, { count: data[existed].count })
        } else {
          axios.post(url, { ...cat, count: 1 })
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
      this.$store.catData.cartList = []

      try {
        const cartList = (await axios.get(this.url)).data
        for (const cat of cartList) {
          await axios.delete(`${this.url}/${cat.id}`)
        }
      } catch (err) {
        console.log("清空購物車失敗", err)
      }
    },
  }
}

export { productListControl, cartControl }
