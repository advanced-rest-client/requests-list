import { css } from 'lit-element';

export default css`
:host {
  --anypoint-item-icon-width: 72px;
}

.history-group {
  user-select: none;
  font-weight: var(--requests-list-history-group-header-font-weight, 500);
  color: var(--requests-list-item-history-group-header-color, rgba(0, 0, 0, 0.67));
  padding: 4px 16px;
  display: flex;
  align-items: center;
  background-color: #eceff1;
}

.history-group-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  text-transform: uppercase;
}

.history-group-toggle {
  --anypoint-icon-button-emphasis-low-color: currentColor;
}

.toggle-icon {
  transition: transform 0.3s cubic-bezier(0.88, 0.01, 0.49, 0.97) 0s;
}

.history-group.opened .toggle-icon {
  transform: rotate(-180deg);
}

http-method-label {
  font-size: 12px;
  height: 52px;
  width: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 50%;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0; 
}

http-method-label.with-margin {
  margin-right: 12px;
}

:host([listtype="comfortable"]) anypoint-item-body,
:host([listtype="compact"]) anypoint-item-body {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

:host([listtype="comfortable"]) [secondary],
:host([listtype="compact"]) [secondary] {
  margin-left: 8px;
}

:host([listtype="comfortable"]) http-method-label {
  height: 40px;
  width: 40px;
  padding-top: 8px;
}

:host([listtype="compact"]) http-method-label {
  height: 28px;
  width: 28px;
  padding-top: 4px;
  font-size: 11px;
}

:host([listtype="comfortable"]) .request-list-item {
  min-height: var(--request-list-item-comfortable-min-height, 52px);
}

:host([listtype="compact"]) .request-list-item {
  min-height: var(--request-list-item-comfortable-compact-height, 36px);
}

:host([listtype="comfortable"]) .list-action-button {
  height: 32px;
}

:host([listtype="compact"]) .list-action-button {
  height: 24px;
}

:host([listtype="comfortable"]) [secondary],
:host([listtype="compact"]) [secondary] {
  margin-top: 0px;
  font-size: 80%;
}
:host([listtype="comfortable"]) .history-group-toggle {
  width: 32px;
  height: 32px;
}
:host([listtype="compact"]) .history-group-toggle {
  width: 28px;
  height: 28px;
}

anypoint-button {
  box-shadow: none;
}
`;