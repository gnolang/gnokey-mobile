# Design System for GnoKey Mobile

---

## ⚛️ Atomic Design Levels

| Level     | Description                          | Examples                           |
| --------- | ------------------------------------ | ---------------------------------- |
| Atoms     | Smallest building blocks             | `Text`, `Button`, `Icon`, `Input`  |
| Molecules | Groups of atoms functioning together | `InputWithLabel`, `AvatarWithName` |
| Organisms | Complex reusable components          | `VaultCard`, `LoginForm`           |
| Templates | Screen layout patterns with UI zones | `MainLayout`, `ModalLayout`        |

---

## ✅ Component Guidelines

- All components must be **typed with TypeScript**
- Keep `atoms` and `molecules` **pure and stateless**
- Use `props` for customization — no hardcoded styles or text
- Business logic lives outside components — use redux-toolkit, hooks or containers

---

### 🧠 Redux Connection Guidelines by Atomic Layer

### 🧠 Redux Connection Guidelines for Expo Router + Atomic Design

| **Layer / Folder**       | **Connect to Redux?** | **Reason**                                                               |
| ------------------------ | --------------------- | ------------------------------------------------------------------------ |
| `components/atoms/`      | ❌ Never              | Pure UI elements (e.g., `Button`, `Text`). Should be fully reusable.     |
| `components/molecules/`  | ❌ Rarely             | Composed UI blocks — should remain stateless and layout-focused.         |
| `components/organisms/`  | ✅ Sometimes          | May handle data if reused across routes. Use hooks or props to inject.   |
| `components/templates/`  | ✅ Optional           | Ideal for authenticated layouts, theme guards, or nested UIs.            |
| `app/` (screens)         | ✅ Always             | Top-level routing layer in Expo Router — safe to connect Redux directly. |
| `app/_layout.tsx`        | ✅ Optional           | Good place for route guards, shared UI, or auth state checks.            |
| `hooks/`                 | ✅ Recommended        | Encapsulate Redux logic for cleaner components and consistent access.    |

---
