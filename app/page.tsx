'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {
  Boxes,
  LayoutDashboard,
  Package,
  LineChart,
  ShoppingCart,
  Truck,
  Sparkles,
  FileChartColumn,
  Bell,
  Settings,
  CircleHelp,
  Menu,
  X,
  Plus,
  Search,
  RefreshCw,
  LogOut,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Activity,
  Database,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  BarChart3,
  Check,
} from 'lucide-react'

import auth, { firebaseConfigured } from '@/lib/firebase'

import {
  logOut,
  resetPassword,
  signIn,
  signUp,
  type FirebaseUser,
} from '@/lib/firebase-auth'

import {
  createRecord,
  deleteRecord,
  listProducts,
  listPurchases,
  listSales,
  listSuppliers,
  type Product,
  type Purchase,
  type Sale,
  type Supplier,
} from '@/lib/firebase-data'

const pages = [
  ['dashboard', 'Overview', LayoutDashboard],
  ['inventory', 'Inventory', Package],
  ['products', 'Products', Boxes],
  ['sales', 'Sales', LineChart],
  ['purchases', 'Purchases', ShoppingCart],
  ['suppliers', 'Suppliers', Truck],
  ['forecasting', 'Forecasting', Sparkles],
  ['analytics', 'Analytics', FileChartColumn],
  ['alerts', 'Alerts', Bell],
  ['settings', 'Settings', Settings],
  ['help', 'Help center', CircleHelp],
] as const

type PageKey = typeof pages[number][0]

const money = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(n || 0)

export default function Page() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setAuthReady(true)
      return
    }

    return onAuthStateChanged(auth, (next) => {
      setUser(next)
      setAuthReady(true)
    })
  }, [])

  if (!authReady) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <AuthScreen />
  }

  return <Workspace user={user} />
}

/* =========================================================
   AUTH LOADING
========================================================= */

function AuthLoadingScreen() {
  return (
    <div className="auth-shell auth-loading">
      <div className="auth-loading-card">
        <div className="auth-logo-mark">
          <Boxes size={26} />
        </div>

        <div className="auth-loading-line" />

        <strong>Loading StockWise</strong>

        <span>Preparing your secure workspace…</span>
      </div>
    </div>
  )
}

/* =========================================================
   AUTH SCREEN
========================================================= */

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isLogin = mode === 'login'

  function switchMode(nextMode: 'login' | 'signup') {
    setMode(nextMode)
    setMessage('')
    setPassword('')
    setShowPassword(false)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()

    setBusy(true)
    setMessage('')

    try {
      if (!firebaseConfigured) {
        throw new Error(
          'Firebase is not configured. Add your Firebase variables in .env.local.'
        )
      }

      if (mode === 'signup') {
        await signUp(email, password, name)
      } else {
        await signIn(email, password)
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Authentication failed.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function forgot() {
    if (!email) {
      setMessage('Enter your email first.')
      return
    }

    setBusy(true)
    setMessage('')

    try {
      await resetPassword(email)
      setMessage('Password reset email sent. Check your inbox.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not send reset email.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell redesigned-auth">
      {/* Animated background */}
      <div className="auth-grid" />
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-container">
        {/* =================================================
            LEFT SHOWCASE
        ================================================= */}
        <section className="auth-showcase">
          <div className="showcase-top">
            <div className="brand auth-brand">
              <div className="brand-mark">
                <Boxes size={20} />
              </div>

              <span>
                stock<span>wise</span>
              </span>
            </div>

            <div className="secure-badge">
              <ShieldCheck size={14} />
              Secure workspace
            </div>
          </div>

          <div className="showcase-main">
            <p className="eyebrow">
              INVENTORY INTELLIGENCE
            </p>

            <h1>
              Run your inventory
              <br />
              <span>with confidence.</span>
            </h1>

            <p className="showcase-description">
              Keep products, stock, sales and suppliers
              organized in one intelligent workspace built
              for modern businesses.
            </p>

            <div className="showcase-features">
              <div className="showcase-feature">
                <div className="feature-icon">
                  <BarChart3 size={17} />
                </div>

                <div>
                  <strong>Real-time insights</strong>
                  <span>
                    Understand your inventory at a glance.
                  </span>
                </div>
              </div>

              <div className="showcase-feature">
                <div className="feature-icon">
                  <Zap size={17} />
                </div>

                <div>
                  <strong>Smarter operations</strong>
                  <span>
                    Track stock and make faster decisions.
                  </span>
                </div>
              </div>

              <div className="showcase-feature">
                <div className="feature-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <strong>Secure by design</strong>
                  <span>
                    Your workspace is protected with Firebase.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating dashboard preview */}
          <div className="auth-preview">
            <div className="preview-header">
              <div>
                <span>Inventory overview</span>
                <strong>Workspace</strong>
              </div>

              <div className="preview-live">
                <span />
                Live
              </div>
            </div>

            <div className="preview-chart">
              <div className="chart-bars">
                <span style={{ height: '32%' }} />
                <span style={{ height: '48%' }} />
                <span style={{ height: '42%' }} />
                <span style={{ height: '66%' }} />
                <span style={{ height: '55%' }} />
                <span style={{ height: '82%' }} />
                <span style={{ height: '72%' }} />
                <span style={{ height: '94%' }} />
              </div>
            </div>

            <div className="preview-stats">
              <div>
                <span>Products</span>
                <strong>248</strong>
              </div>

              <div>
                <span>Stock value</span>
                <strong>$48.2k</strong>
              </div>

              <div>
                <span>Alerts</span>
                <strong>07</strong>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>
              <span className="live-dot" />
              Firebase powered
            </span>

            <span>StockWise Intelligence</span>
          </div>
        </section>

        {/* =================================================
            RIGHT AUTH FORM
        ================================================= */}
        <section className="auth-form-side">
          <div className="auth-mobile-brand">
            <div className="brand-mark">
              <Boxes size={20} />
            </div>

            <span>
              stock<span>wise</span>
            </span>
          </div>

          <div className="auth-card redesigned-auth-card">
            <div className="auth-card-heading">
              <div className="auth-icon">
                {isLogin ? (
                  <ArrowUpRight size={22} />
                ) : (
                  <Plus size={22} />
                )}
              </div>

              <div>
                <p className="eyebrow">
                  {isLogin
                    ? 'WELCOME BACK'
                    : 'GET STARTED'}
                </p>

                <h2>
                  {isLogin
                    ? 'Sign in to StockWise'
                    : 'Create your workspace'}
                </h2>

                <p className="auth-card-subtitle">
                  {isLogin
                    ? 'Continue managing your inventory with ease.'
                    : 'Start managing your inventory smarter today.'}
                </p>
              </div>
            </div>

            {/* Auth tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={isLogin ? 'active' : ''}
                onClick={() => switchMode('login')}
              >
                Sign in
              </button>

              <button
                type="button"
                className={!isLogin ? 'active' : ''}
                onClick={() => switchMode('signup')}
              >
                Register
              </button>
            </div>

            <form
              onSubmit={submit}
              className="auth-form modern-auth-form"
            >
              {mode === 'signup' && (
                <label>
                  <span>Full name</span>

                  <div className="input-wrap">
                    <input
                      required
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter your name"
                      autoComplete="name"
                    />
                  </div>
                </label>
              )}

              <label>
                <span>Email address</span>

                <div className="input-wrap">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label>
                <div className="password-label-row">
                  <span>Password</span>

                  {isLogin && (
                    <button
                      type="button"
                      className="forgot-inline"
                      onClick={forgot}
                      disabled={busy}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="input-wrap password-wrap">
                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete={
                      isLogin
                        ? 'current-password'
                        : 'new-password'
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              {message && (
                <div className="auth-message">
                  <AlertTriangle size={16} />
                  <span>{message}</span>
                </div>
              )}

              {!isLogin && (
                <div className="terms-note">
                  <Check size={15} />
                  <span>
                    Your account is protected by Firebase
                    Authentication.
                  </span>
                </div>
              )}

              <button
                className="button primary auth-submit"
                disabled={busy}
                type="submit"
              >
                {busy ? (
                  <>
                    <span className="button-spinner" />
                    Please wait…
                  </>
                ) : (
                  <>
                    {isLogin
                      ? 'Sign in'
                      : 'Create account'}
                    <ArrowUpRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span />
              <p>Secure access</p>
              <span />
            </div>

            <div className="auth-security">
              <ShieldCheck size={17} />

              <div>
                <strong>Your data stays protected</strong>
                <span>
                  Authentication and workspace access are
                  handled securely.
                </span>
              </div>
            </div>

            <p className="auth-switch">
              {isLogin
                ? "Don't have a StockWise account?"
                : 'Already have a StockWise account?'}

              <button
                type="button"
                onClick={() =>
                  switchMode(
                    isLogin ? 'signup' : 'login'
                  )
                }
              >
                {isLogin
                  ? 'Create one'
                  : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="auth-bottom">
            <span>© {new Date().getFullYear()} StockWise</span>
            <span>Inventory Intelligence</span>
          </div>
        </section>
      </div>
    </div>
  )
}

/* =========================================================
   WORKSPACE
========================================================= */

function Workspace({ user }: { user: FirebaseUser }) {
  const [page, setPage] = useState<PageKey>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  async function refresh() {
    setLoading(true)
    setError('')

    try {
      const [p, s, pu, su] = await Promise.all([
        listProducts(user.uid),
        listSales(user.uid),
        listPurchases(user.uid),
        listSuppliers(user.uid),
      ])

      setProducts(p)
      setSales(s)
      setPurchases(pu)
      setSuppliers(su)
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not load Firestore data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [user.uid])

  useEffect(() => {
    const sync = () => {
      const next = location.hash.slice(1) || 'dashboard'

      if (pages.some((p) => p[0] === next)) {
        setPage(next as PageKey)
      }
    }

    sync()

    addEventListener('hashchange', sync)

    return () =>
      removeEventListener('hashchange', sync)
  }, [])

  const title =
    pages.find((p) => p[0] === page)?.[1] || 'Overview'

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        `${p.name} ${p.sku} ${p.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [products, query]
  )

  const low = products.filter(
    (p) =>
      p.stock > 0 &&
      p.stock <= p.reorderLevel
  )

  const out = products.filter(
    (p) => p.stock <= 0
  )

  const value = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  )

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          menuOpen ? 'open' : ''
        }`}
      >
        <div className="brand">
          <div className="brand-mark">
            <Boxes size={19} />
          </div>

          <span>
            stock<span>wise</span>
          </span>

          <button
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">
            {(user.displayName ||
              user.email ||
              'U')[0].toUpperCase()}
          </div>

          <div>
            <p className="workspace-name">
              {user.displayName ||
                'My workspace'}
            </p>

            <p className="workspace-meta">
              {user.email}
            </p>
          </div>
        </div>

        <p className="nav-label">
          Workspace
        </p>

        <nav className="main-nav">
          {pages
            .slice(0, 6)
            .map(
              ([
                key,
                label,
                Icon,
              ]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className={
                    page === key
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>

                  {page === key && (
                    <span className="nav-active-dot" />
                  )}
                </a>
              )
            )}
        </nav>

        <p className="nav-label">
          Intelligence
        </p>

        <nav className="main-nav">
          {pages
            .slice(6, 9)
            .map(
              ([
                key,
                label,
                Icon,
              ]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className={
                    page === key
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>

                  {page === key && (
                    <span className="nav-active-dot" />
                  )}
                </a>
              )
            )}
        </nav>

        <div className="sidebar-bottom">
          {pages
            .slice(9)
            .map(
              ([
                key,
                label,
                Icon,
              ]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className={
                    page === key
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              )
            )}

          <button
            className="logout-button"
            onClick={() =>
              void logOut()
            }
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() =>
              setMenuOpen(true)
            }
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="slash">
              /
            </span>
            <strong>{title}</strong>
          </div>

          <div className="top-actions">
            <div className="search-wrap">
              <Search size={17} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search products, SKU, suppliers…"
              />
            </div>

            <div className="top-avatar">
              {(user.displayName ||
                user.email ||
                'U')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row animate-page">
            <div>
              <p className="eyebrow">
                StockWise workspace
              </p>

              <h1>{title}</h1>

              <p className="subtitle">
                Live data secured by Firebase
                Authentication and Firestore.
              </p>
            </div>

            <div className="header-buttons">
              <button
                className="button secondary"
                onClick={() =>
                  void refresh()
                }
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              {(page === 'products' ||
                page === 'inventory') && (
                <button
                  className="button primary"
                  onClick={() =>
                    setShowAdd(true)
                  }
                >
                  <Plus size={17} />
                  Add product
                </button>
              )}
            </div>
          </section>

          {error && (
            <div className="empty-alerts error-text">
              {error}
            </div>
          )}

          {loading ? (
            <div className="panel table-panel loading-panel">
              <div className="loading-animation">
                <div className="loading-ring" />

                <strong>
                  Loading your Firestore data…
                </strong>

                <span>
                  Preparing your workspace
                </span>
              </div>
            </div>
          ) : page === 'dashboard' ? (
            <Dashboard
              products={products}
              sales={sales}
              purchases={purchases}
              low={low}
              out={out}
              value={value}
            />
          ) : page === 'products' ||
            page === 'inventory' ? (
            <ProductTable
              products={
                filteredProducts
              }
              inventory={
                page === 'inventory'
              }
              onDelete={async (id) => {
                if (
                  confirm(
                    'Delete this product?'
                  )
                ) {
                  await deleteRecord(
                    'products',
                    id
                  )

                  void refresh()
                }
              }}
            />
          ) : page === 'sales' ? (
            <TransactionTable
              title="Sales history"
              rows={sales}
              amount="totalAmount"
            />
          ) : page === 'purchases' ? (
            <TransactionTable
              title="Purchase history"
              rows={purchases}
              amount="totalCost"
            />
          ) : page === 'suppliers' ? (
            <SupplierTable
              rows={suppliers}
              query={query}
            />
          ) : page === 'alerts' ? (
            <Alerts
              products={[
                ...low,
                ...out,
              ]}
            />
          ) : page === 'analytics' ||
            page === 'forecasting' ? (
            <Insights
              products={products}
              sales={sales}
              forecasting={
                page === 'forecasting'
              }
            />
          ) : (
            <SimplePage
              title={title}
              user={user}
              firebaseConfigured={
                firebaseConfigured
              }
            />
          )}

        <footer className="stockwise-footer">
          <div className="footer-brand">
            <div className="footer-brand-mark">
              <Boxes size={17} />
            </div>

            <div>
              <strong>
                stock<span>wise</span>
              </strong>

              <span>
                Inventory intelligence for modern businesses.
              </span>
            </div>
          </div>

          <div className="footer-links">
            <a href="#dashboard">Overview</a>
            <a href="#inventory">Inventory</a>
            <a href="#analytics">Analytics</a>
            <a href="#settings">Settings</a>
          </div>

          <div className="footer-status">
            <span className="footer-status-dot" />

            <span>
              Firebase connected
            </span>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} StockWise. All rights reserved.
            </span>

            <span>
              Built for smarter inventory management
            </span>
          </div>
        </footer>
        </div>
      </main>

      {showAdd && (
        <ProductForm
          userId={user.uid}
          onClose={() =>
            setShowAdd(false)
          }
          onSaved={() => {
            setShowAdd(false)
            void refresh()
          }}
        />
      )}
    </div>
  )
}

/* =========================================================
   DASHBOARD / OVERVIEW
========================================================= */

function Dashboard({
  products,
  sales,
  purchases,
  low,
  out,
  value,
}: {
  products: Product[]
  sales: Sale[]
  purchases: Purchase[]
  low: Product[]
  out: Product[]
  value: number
}) {
  const unitsSold = sales.reduce(
    (total, sale) => total + Number(sale.quantity || 0),
    0
  )

  const totalSales = sales.reduce(
    (total, sale) => total + Number(sale.totalAmount || 0),
    0
  )

  const totalPurchases = purchases.reduce(
    (total, purchase) =>
      total + Number(purchase.totalCost || 0),
    0
  )

  const alerts = [...out, ...low]

  const stockUnits = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  )

  const healthyProducts = products.filter(
    (product) =>
      product.stock > product.reorderLevel
  ).length

  const healthPercentage = products.length
    ? Math.round(
        (healthyProducts / products.length) * 100
      )
    : 100

  const topProducts = Object.values(
    sales.reduce(
      (acc, sale) => {
        const name = sale.productName || 'Unknown product'

        if (!acc[name]) {
          acc[name] = {
            name,
            units: 0,
            revenue: 0,
          }
        }

        acc[name].units += Number(sale.quantity || 0)
        acc[name].revenue += Number(
          sale.totalAmount || 0
        )

        return acc
      },
      {} as Record<
        string,
        {
          name: string
          units: number
          revenue: number
        }
      >
    )
  )
    .sort((a, b) => b.units - a.units)
    .slice(0, 5)

  const recentSales = [...sales]
    .sort((a, b) => {
      const dateA = new Date(
        a.saleDate || ''
      ).getTime()

      const dateB = new Date(
        b.saleDate || ''
      ).getTime()

      return dateB - dateA
    })
    .slice(0, 5)

  const chartValues = [35, 48, 42, 62, 54, 78, 68, 88]

  return (
    <section className="overview-dashboard animate-page">

      {/* =================================================
          HERO
      ================================================= */}

      <div className="overview-hero panel">

        <div className="overview-hero-content">
          <div className="hero-kicker">
            <span className="live-dot" />
            LIVE INVENTORY OVERVIEW
          </div>

          <h2>
            Everything under control.
          </h2>

          <p>
            Monitor your inventory, sales and stock health
            from one simple workspace.
          </p>

          <div className="hero-mini-stats">
            <div>
              <strong>
                {products.length}
              </strong>

              <span>Products</span>
            </div>

            <div>
              <strong>
                {stockUnits.toLocaleString()}
              </strong>

              <span>Units in stock</span>
            </div>

            <div>
              <strong>
                {alerts.length}
              </strong>

              <span>Alerts</span>
            </div>
          </div>
        </div>

        <div className="overview-hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-floating-card">
            <div className="floating-card-icon">
              <Activity size={19} />
            </div>

            <div>
              <span>Inventory health</span>

              <strong>
                {healthPercentage}%
              </strong>
            </div>

            <div className="health-progress">
              <span
                style={{
                  width: `${healthPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <div className="overview-kpi-grid">

        <div className="overview-kpi-card">
          <div className="kpi-top">
            <span>Total sales</span>

            <div className="kpi-icon">
              <TrendingUp size={18} />
            </div>
          </div>

          <strong>
            {money(totalSales)}
          </strong>

          <div className="kpi-footer">
            <span className="kpi-positive">
              <ArrowUpRight size={14} />
              Revenue
            </span>

            <span>
              {sales.length} records
            </span>
          </div>
        </div>

        <div className="overview-kpi-card">
          <div className="kpi-top">
            <span>Inventory value</span>

            <div className="kpi-icon">
              <Package size={18} />
            </div>
          </div>

          <strong>
            {money(value)}
          </strong>

          <div className="kpi-footer">
            <span>
              {products.length} products
            </span>

            <span>
              {stockUnits.toLocaleString()} units
            </span>
          </div>
        </div>

        <div className="overview-kpi-card">
          <div className="kpi-top">
            <span>Low stock</span>

            <div className="kpi-icon warning">
              <AlertTriangle size={18} />
            </div>
          </div>

          <strong>
            {low.length}
          </strong>

          <div className="kpi-footer">
            <span>
              Need attention
            </span>

            <span>
              Reorder soon
            </span>
          </div>
        </div>

        <div className="overview-kpi-card">
          <div className="kpi-top">
            <span>Suppliers</span>

            <div className="kpi-icon">
              <Truck size={18} />
            </div>
          </div>

          <strong>
            {purchases.length
              ? purchases.length
              : '—'}
          </strong>

          <div className="kpi-footer">
            <span>
              Purchase activity
            </span>

            <span>
              {money(totalPurchases)}
            </span>
          </div>
        </div>

      </div>

      {/* =================================================
          MAIN ANALYTICS ROW
      ================================================= */}

      <div className="overview-main-grid">

        {/* Sales chart */}

        <div className="panel overview-chart-panel">

          <div className="panel-head">
            <div>
              <p className="section-kicker">
                PERFORMANCE
              </p>

              <h2>
                Sales activity
              </h2>

              <p>
                Visual snapshot of recorded sales
              </p>
            </div>

            <div className="panel-icon">
              <LineChart size={20} />
            </div>
          </div>

          <div className="overview-chart">

            <div className="chart-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0</span>
            </div>

            <div className="chart-area">

              <div className="chart-grid-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="overview-bars">
                {chartValues.map(
                  (height, index) => (
                    <div
                      className="overview-bar-column"
                      key={index}
                    >
                      <div
                        className="overview-bar"
                        style={{
                          height: `${height}%`,
                          animationDelay: `${
                            index * 70
                          }ms`,
                        }}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

            </div>

          </div>

          <div className="chart-summary">
            <div>
              <span>Total revenue</span>

              <strong>
                {money(totalSales)}
              </strong>
            </div>

            <div>
              <span>Units sold</span>

              <strong>
                {unitsSold.toLocaleString()}
              </strong>
            </div>
          </div>

        </div>

        {/* Inventory health */}

        <div className="panel inventory-health-panel">

          <div className="panel-head">
            <div>
              <p className="section-kicker">
                INVENTORY HEALTH
              </p>

              <h2>
                Stock health
              </h2>

              <p>
                Current product availability
              </p>
            </div>

            <div className="panel-icon">
              <Activity size={20} />
            </div>
          </div>

          <div className="health-circle-wrap">

            <div
              className="health-circle"
              style={{
                background: `conic-gradient(
                  var(--sw-teal) ${healthPercentage}%,
                  var(--sw-line) ${healthPercentage}% 100%
                )`,
              }}
            >
              <div className="health-circle-inner">
                <strong>
                  {healthPercentage}%
                </strong>

                <span>
                  Healthy
                </span>
              </div>
            </div>

          </div>

          <div className="health-list">

            <div>
              <span>
                <i className="health-dot healthy" />
                Healthy stock
              </span>

              <strong>
                {healthyProducts}
              </strong>
            </div>

            <div>
              <span>
                <i className="health-dot low" />
                Low stock
              </span>

              <strong>
                {low.length}
              </strong>
            </div>

            <div>
              <span>
                <i className="health-dot out" />
                Out of stock
              </span>

              <strong>
                {out.length}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          LOWER ROW
      ================================================= */}

      <div className="overview-lower-grid">

        {/* Top products */}

        <div className="panel overview-list-panel">

          <div className="panel-head">

            <div>
              <p className="section-kicker">
                PRODUCT PERFORMANCE
              </p>

              <h2>
                Top products
              </h2>

              <p>
                Products with the highest units sold
              </p>
            </div>

            <div className="panel-icon">
              <Package size={20} />
            </div>

          </div>

          {topProducts.length ? (
            <div className="top-product-list">

              {topProducts.map(
                (product, index) => (
                  <div
                    className="top-product"
                    key={product.name}
                    style={{
                      animationDelay: `${
                        index * 70
                      }ms`,
                    }}
                  >

                    <div className="product-rank">
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </div>

                    <div className="product-info">
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.units} units sold
                      </span>
                    </div>

                    <strong className="product-revenue">
                      {money(product.revenue)}
                    </strong>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="overview-empty">
              <div className="empty-icon">
                <Package size={20} />
              </div>

              <strong>
                No product activity yet
              </strong>

              <span>
                Sales will appear here once recorded.
              </span>
            </div>
          )}

        </div>

        {/* Recent transactions */}

        <div className="panel overview-list-panel">

          <div className="panel-head">

            <div>
              <p className="section-kicker">
                RECENT ACTIVITY
              </p>

              <h2>
                Recent sales
              </h2>

              <p>
                Latest recorded transactions
              </p>
            </div>

            <div className="panel-icon">
              <ShoppingCart size={20} />
            </div>

          </div>

          {recentSales.length ? (
            <div className="recent-sales-list">

              {recentSales.map(
                (sale, index) => (
                  <div
                    className="recent-sale"
                    key={sale.id}
                    style={{
                      animationDelay: `${
                        index * 70
                      }ms`,
                    }}
                  >

                    <div className="recent-sale-icon">
                      <ShoppingCart size={15} />
                    </div>

                    <div className="recent-sale-info">
                      <strong>
                        {sale.productName}
                      </strong>

                      <span>
                        {sale.quantity} units
                        {sale.saleDate
                          ? ` · ${sale.saleDate}`
                          : ''}
                      </span>
                    </div>

                    <strong>
                      {money(
                        Number(
                          sale.totalAmount || 0
                        )
                      )}
                    </strong>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="overview-empty">
              <div className="empty-icon">
                <Activity size={20} />
              </div>

              <strong>
                No recent sales
              </strong>

              <span>
                Your latest transactions will appear here.
              </span>
            </div>
          )}

        </div>

      </div>

      {/* =================================================
          SMART INSIGHT
      ================================================= */}

      <div className="overview-insight panel">

        <div className="insight-icon">
          <Sparkles size={21} />
        </div>

        <div className="insight-content">

          <p className="section-kicker">
            STOCKWISE INSIGHT
          </p>

          <h2>
            {alerts.length
              ? `${alerts.length} product${
                  alerts.length === 1
                    ? ''
                    : 's'
                } need attention.`
              : 'Your inventory is looking healthy.'}
          </h2>

          <p>
            {alerts.length
              ? 'Review your low-stock and out-of-stock products to avoid interruptions to your operations.'
              : 'There are currently no products below their reorder levels.'}
          </p>

        </div>

        <a
          href="#alerts"
          className="insight-action"
        >
          Review inventory
          <ArrowUpRight size={16} />
        </a>

      </div>

    </section>
  )
}

/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
  index = 0,
}: {
  label: string
  value: string | number
  index?: number
}) {
  return (
    <div
      className="metric-card metric-animated"
      style={{
        animationDelay: `${index * 70}ms`,
      }}
    >
      <p className="metric-label">
        {label}
      </p>

      <p className="metric-value">
        {value}
      </p>

      <div className="metric-line">
        <span />
      </div>
    </div>
  )
}

/* =========================================================
   PRODUCTS
========================================================= */

function ProductTable({
  products,
  inventory,
  onDelete,
}: {
  products: Product[]
  inventory: boolean
  onDelete: (id: string) => void
}) {
  return (
    <section className="panel table-panel animate-page">
      <div className="panel-head">
        <div>
          <p className="section-kicker">
            {inventory
              ? 'STOCK CONTROL'
              : 'CATALOG'}
          </p>

          <h2>
            {inventory
              ? 'Inventory'
              : 'Products'}
          </h2>

          <p>
            {products.length} records in
            your workspace
          </p>
        </div>

        <div className="panel-icon">
          <Package size={20} />
        </div>
      </div>

      {!products.length ? (
        <div className="empty-alerts">
          <div className="empty-icon">
            <Package size={20} />
          </div>

          <strong>
            No products yet
          </strong>

          <span>
            Add your first product to
            begin.
          </span>
        </div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>
                      {p.name}
                    </strong>
                  </td>

                  <td>{p.sku}</td>

                  <td>
                    {p.category || '—'}
                  </td>

                  <td>
                    {money(p.price)}
                  </td>

                  <td>
                    <strong>
                      {p.stock}
                    </strong>
                  </td>

                  <td>
                    <span className="status-pill">
                      {p.stock <= 0
                        ? 'Out of Stock'
                        : p.stock <=
                            p.reorderLevel
                          ? 'Low Stock'
                          : 'In Stock'}
                    </span>
                  </td>

                  <td>
                    <button
                      className="icon-button"
                      onClick={() =>
                        onDelete(p.id)
                      }
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* =========================================================
   TRANSACTIONS
========================================================= */

function TransactionTable({
  title,
  rows,
  amount,
}: {
  title: string
  rows: (Sale | Purchase)[]
  amount:
    | 'totalAmount'
    | 'totalCost'
}) {
  return (
    <section className="panel table-panel animate-page">
      <div className="panel-head">
        <div>
          <p className="section-kicker">
            TRANSACTIONS
          </p>

          <h2>{title}</h2>

          <p>
            {rows.length} recorded
            transactions
          </p>
        </div>

        <div className="panel-icon">
          <LineChart size={20} />
        </div>
      </div>

      {!rows.length ? (
        <div className="empty-alerts">
          <div className="empty-icon">
            <Activity size={20} />
          </div>

          <strong>
            No data yet
          </strong>

          <span>
            Recorded transactions will
            appear here.
          </span>
        </div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>
                      {r.productName}
                    </strong>
                  </td>

                  <td>
                    {r.quantity}
                  </td>

                  <td>
                    {money(
                      Number(
                        amount ===
                          'totalAmount'
                          ? (
                              r as Sale
                            )
                              .totalAmount
                          : (
                              r as Purchase
                            )
                              .totalCost
                      )
                    )}
                  </td>

                  <td>
                    {'saleDate' in r
                      ? r.saleDate
                      : r.purchaseDate ||
                        '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* =========================================================
   SUPPLIERS
========================================================= */

function SupplierTable({
  rows,
  query,
}: {
  rows: Supplier[]
  query: string
}) {
  const filtered = rows.filter(
    (s) =>
      `${s.name} ${s.company} ${s.email}`
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
  )

  return (
    <section className="panel table-panel animate-page">
      <div className="panel-head">
        <div>
          <p className="section-kicker">
            SUPPLIER NETWORK
          </p>

          <h2>Suppliers</h2>

          <p>
            {filtered.length} supplier
            records
          </p>
        </div>

        <div className="panel-icon">
          <Truck size={20} />
        </div>
      </div>

      {!filtered.length ? (
        <div className="empty-alerts">
          <div className="empty-icon">
            <Truck size={20} />
          </div>

          <strong>
            No suppliers found
          </strong>

          <span>
            Your supplier records will
            appear here.
          </span>
        </div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>
                      {s.name}
                    </strong>
                  </td>

                  <td>
                    {s.company || '—'}
                  </td>

                  <td>
                    {s.email || '—'}
                  </td>

                  <td>
                    {s.phone || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* =========================================================
   ALERTS
========================================================= */

function Alerts({
  products,
}: {
  products: Product[]
}) {
  return (
    <section className="panel table-panel animate-page">
      <div className="panel-head">
        <div>
          <p className="section-kicker">
            INVENTORY HEALTH
          </p>

          <h2>Alerts</h2>

          <p>
            Generated from current
            product stock
          </p>
        </div>

        <div className="alert-count">
          <AlertTriangle size={16} />
          <strong>
            {products.length}
          </strong>
        </div>
      </div>

      {!products.length ? (
        <div className="empty-alerts">
          <div className="empty-icon">
            <Activity size={20} />
          </div>

          <strong>
            No active alerts
          </strong>

          <span>
            Your inventory currently
            looks healthy.
          </span>
        </div>
      ) : (
        <div className="alert-list">
          {products.map(
            (p, index) => (
              <div
                className="alert-item alert-animated"
                key={p.id}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <div className="alert-item-icon">
                  <AlertTriangle
                    size={16}
                  />
                </div>

                <div>
                  <strong>
                    {p.name}
                  </strong>

                  <span>
                    {p.stock <= 0
                      ? 'Out of stock'
                      : `Low stock: ${p.stock} remaining`}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  )
}

/* =========================================================
   INSIGHTS
========================================================= */

function Insights({
  products,
  sales,
  forecasting,
}: {
  products: Product[]
  sales: Sale[]
  forecasting: boolean
}) {
  const totalSales =
    sales.reduce(
      (n, s) =>
        n + s.totalAmount,
      0
    )

  const unitsSold =
    sales.reduce(
      (n, s) =>
        n + s.quantity,
      0
    )

  return (
    <section className="panel table-panel animate-page">
      <div className="panel-head">
        <div>
          <p className="section-kicker">
            {forecasting
              ? 'INTELLIGENCE'
              : 'REPORTING'}
          </p>

          <h2>
            {forecasting
              ? 'Demand forecast'
              : 'Analytics'}
          </h2>

          <p>
            {forecasting
              ? 'Simple estimate based on recorded sales'
              : 'Actual Firestore data only'}
          </p>
        </div>

        <div className="panel-icon">
          {forecasting ? (
            <Sparkles size={20} />
          ) : (
            <FileChartColumn
              size={20}
            />
          )}
        </div>
      </div>

      {!sales.length ? (
        <div className="empty-alerts">
          <div className="empty-icon">
            <TrendingUp size={20} />
          </div>

          <strong>
            No sales data yet
          </strong>

          <span>
            Record sales to generate
            insights.
          </span>
        </div>
      ) : (
        <div className="help-grid">
          <div>
            <span>
              Total sales
            </span>

            <strong>
              {money(totalSales)}
            </strong>
          </div>

          <div>
            <span>
              Units sold
            </span>

            <strong>
              {unitsSold.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>
              Tracked products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>
        </div>
      )}
    </section>
  )
}

/* =========================================================
   SIMPLE PAGE
========================================================= */

function SimplePage({
  title,
  user,
  firebaseConfigured,
}: {
  title: string
  user: FirebaseUser
  firebaseConfigured: boolean
}) {
  return (
    <section className="panel table-panel animate-page">
      <div className="panel-head">
        <div>
          <p className="section-kicker">
            WORKSPACE
          </p>

          <h2>{title}</h2>

          <p>
            {title === 'Settings'
              ? 'Your account and connection details.'
              : 'StockWise workspace tools.'}
          </p>
        </div>

        <div className="panel-icon">
          {title === 'Settings' ? (
            <Settings size={20} />
          ) : (
            <CircleHelp size={20} />
          )}
        </div>
      </div>

      <div className="settings-list">
        <div>
          <strong>
            Signed in as
          </strong>

          <span>
            {user.email}
          </span>
        </div>

        <div>
          <strong>
            Backend
          </strong>

          <span className="status-pill">
            {firebaseConfigured
              ? 'Firebase connected'
              : 'Configuration needed'}
          </span>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   PRODUCT FORM
========================================================= */

function ProductForm({
  userId,
  onClose,
  onSaved,
}: {
  userId: string
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] =
    useState('')

  const [sku, setSku] =
    useState('')

  const [category, setCategory] =
    useState('')

  const [price, setPrice] =
    useState('')

  const [stock, setStock] =
    useState('')

  const [reorderLevel, setReorderLevel] =
    useState('10')

  const [error, setError] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()

    setSaving(true)
    setError('')

    try {
      await createRecord(
        'products',
        userId,
        {
          name,
          sku,
          category,
          price: Number(price),
          stock: Number(stock),
          reorderLevel:
            Number(reorderLevel),
        }
      )

      onSaved()
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not save product.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <form
        className="modal panel"
        onSubmit={submit}
      >
        <div className="panel-head">
          <div>
            <p className="section-kicker">
              NEW RECORD
            </p>

            <h2>
              Add product
            </h2>

            <p>
              Save a product to your
              Firestore workspace.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <label>
          Product name

          <input
            required
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Product name"
          />
        </label>

        <label>
          SKU

          <input
            required
            value={sku}
            onChange={(e) =>
              setSku(e.target.value)
            }
            placeholder="SKU-001"
          />
        </label>

        <label>
          Category

          <input
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            placeholder="Category"
          />
        </label>

        <div className="form-grid">
          <label>
            Price

            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              placeholder="0.00"
            />
          </label>

          <label>
            Stock

            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) =>
                setStock(
                  e.target.value
                )
              }
              placeholder="0"
            />
          </label>
        </div>

        <label>
          Reorder level

          <input
            type="number"
            min="0"
            required
            value={reorderLevel}
            onChange={(e) =>
              setReorderLevel(
                e.target.value
              )
            }
          />
        </label>

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <div className="header-buttons">
          <button
            type="button"
            className="button secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="button primary"
            disabled={saving}
          >
            {saving
              ? 'Saving…'
              : 'Save product'}

            <Plus size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}

