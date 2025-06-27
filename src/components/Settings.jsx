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
          <Option index={0}>
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
          </Option>
          <Option index={1}>
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
          </Option>
          <Option index={2}>
            <span>Capitalization</span>
            <select
              name="capitalization"
              onInput={e => {
                let newValue = e.target.value
                newValue = JSON.parse(newValue)
                setSettings({
                  ...settings,
                  capitalization: newValue,
                })
              }}
              value={settings.capitalization}
            >
              <option value={false}>Off</option>
              <option value={true}>On</option>
            </select>
          </Option>
          <Option index={3}>
            <span>Punctuation</span>
            <select
              name="punctuation"
              onInput={e => {
                let newValue = e.target.value
                newValue = JSON.parse(newValue)
                setSettings({
                  ...settings,
                  punctuation: newValue,
                })
              }}
              value={settings.punctuation}
            >
              <option value={false}>Off</option>
              <option value={true}>On</option>
            </select>
          </Option>
        </ul>
      </div>
    </>
  )
}
const Option = ({ children, index }) => {
  return (
    <li className="settings-options__option" style={`--index: ${index}`}>
      {children}
    </li>
  )
}
export default Settings
