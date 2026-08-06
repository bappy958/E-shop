# Contributing to Unique Collection 4.0

Thank you for considering contributing to **Unique Collection 4.0**! We welcome bug reports, code fixes, new feature proposals, documentation updates, and performance optimizations.

---

## 📜 Code of Conduct

Maintain an inclusive, polite, and constructive tone across all issues, pull requests, and discussions.

---

## 🛠️ Development Workflow

### 1. Fork & Clone Repository
```bash
git clone https://github.com/your-org/unique-collection.git
cd unique-collection
npm install
```

### 2. Create Feature Branch
Naming convention: `feature/short-description` or `fix/issue-description`
```bash
git checkout -b feature/bKash-refund-integration
```

### 3. Local Verification & Quality Checks
Before submitting a Pull Request, verify code formatting, linting, and build integrity:

```bash
# Run TypeScript compilation & lint check
npm run lint

# Run full Vite build verification
npm run build
```

---

## 📏 Coding & Style Standards

- **TypeScript**: Strict type checking enabled. Avoid using `any` whenever possible; define typed interfaces in `src/types/index.ts`.
- **Component Design**: Modular functional React components with standard React Hooks.
- **Styling**: Tailwind CSS utility classes exclusively. Keep color scheme consistent with dark gold brand theme (`#D4AF37`).
- **Bilingual Content**: Ensure new customer-facing text includes both Bengali (`Bn`) and English (`En`) translations.

---

## 📝 Submitting Pull Requests

1. Keep PRs focused on a single logical change.
2. Include a clear title and description detailing what was changed and why.
3. Reference relevant GitHub issue numbers (e.g. `Fixes #42`).
4. Ensure all CI checks pass (`npm run lint` and `npm run build`).
