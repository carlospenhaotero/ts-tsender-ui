# TSender UI

A 100% client-side UI for the [TSender contract](https://github.com/Cyfrin/TSender/).  
Built with **Next.js + TypeScript + Wagmi**.

---

## 🚀 Getting Started

### ✅ Requirements

Make sure you have the following installed:

- **Node.js**  
  Check with:
  ```bash
  node --version
  ```
  Example output:
  ```
  v23.0.1
  ```

- **pnpm**  
  Check with:
  ```bash
  pnpm --version
  ```
  Example output:
  ```
  10.1.0
  ```

- **Git**  
  Check with:
  ```bash
  git --version
  ```
  Example output:
  ```
  git version 2.33.0
  ```

---

### 🔑 Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

> 💡 You can get your `Project ID` from [Reown Cloud](https://cloud.reown.com).

---

### ⚙️ Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/carlospenhaotero/ts-tsender-ui
   cd ts-tsender-ui
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start a local network with Anvil:
   ```bash
   pnpm anvil
   ```

   > ⚠️ Make sure your **MetaMask/Rabby** wallet is connected to the Anvil instance.  
   > Ideally, use the default Anvil wallet, which comes preloaded with mock tokens.

4. In another terminal, run the frontend:
   ```bash
   pnpm run dev
   ```

   The project will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

### Unit tests

Run the unit tests with:

```bash
pnpm test:unit
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🌟 Future Improvements

- UI/UX improvements (colors, typography, better responsive design).  
- Add loading indicators and clearer user notifications.     
- Advanced validation of addresses and amounts before sending.  
- Add a tx resume

