console.log("Servidor iniciando...")

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando 🚀" })
})

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001")
})