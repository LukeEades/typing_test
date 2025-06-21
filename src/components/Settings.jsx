import { useState } from "preact/hooks"
import classNames from "classnames"
const Settings = ({ settings, setSettings }) => {
  const [open, setOpen] = useState(false)
  const settingsClass = classNames({
    settings: true,
    "settings--open": open,
  })
  return (
    <>
      <button
        className="settings-button"
        aria-label="settings-button"
        onClick={() => setOpen(!open)}
      >
        Settings
      </button>
      <div className={settingsClass}>
        <ul className="settings-options">
          <li className="settings-options__option">
            <span>Time (seconds)</span>
            <input
              type="number"
              aria-label="timer-value"
              name="timer-value"
              value={settings.time}
              onInput={e => {
                setSettings({
                  ...settings,
                  time: e.target.value,
                })
              }}
            />
          </li>
          <li className="settings-options__option">
            <span>Theme</span>
            <select
              name="theme"
              onInput={e => {
                setSettings({
                  ...settings,
                  theme: e.target.value,
                })
              }}
              value={settings.theme}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </li>
          <li className="settings-options__option">
            <span>Capitalization</span>
            <select
              name="capitalization"
              onInput={e => {
                setSettings({
                  ...settings,
                  capitalization: e.target.value,
                })
              }}
              value={settings.capitalization}
            >
              <option value={false}>Off</option>
              <option value={true}>On</option>
            </select>
          </li>
          <li className="settings-options__option">
            <span>Punctuation</span>
            <select
              name="punctuation"
              onInput={e => {
                setSettings({
                  ...settings,
                  punctuation: e.target.value,
                })
              }}
              value={settings.punctuation}
            >
              <option value={false}>Off</option>
              <option value={true}>On</option>
            </select>
          </li>
        </ul>
      </div>
    </>
  )
}
export default Settings
