import { useEffect, useState } from 'react'
import './App.css'
import { AddContactRequest, AddNotifyGroupMemberRequest, AddNotifyGroupsRequest, API_URL, DeleteContactRequest, DeleteNotifyGroupsRequest, GetContactsRequest, GetNotifyGroupsRequest, RemoveNotifyGroupMemberRequest, SaveContactRequest } from './http'
import { iContact, iNotifyGorup } from './interfaces';


const NotiFyGroupCard = ({ notifyGroup, onDelete, icontacts }: { notifyGroup: iNotifyGorup, onDelete: Function, icontacts: iContact[] }) => {

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [contacts] = useState<iContact[]>(icontacts);
  const [ntg, setNtg] = useState<iNotifyGorup>(notifyGroup);

  // const getContacts = async () => {
  //   setContacts(await GetContactsRequest());
  // }

  // useEffect(() => {
  //   getContacts()
  // }, []);

  const addMemberClick = async (type: "email" | "telegram", member: string) => {
    const result = await AddNotifyGroupMemberRequest(ntg.name, type, member);
    if (result) {
      const newNth = { ...ntg };
      newNth[type].push(member);
      setNtg(newNth);
    } else {
      alert("Ошибка!");
    }
  }

  const RemoveMemberClick = async (type: "email" | "telegram", member: string) => {
    const result = await RemoveNotifyGroupMemberRequest(ntg.name, type, member);
    if (result) {
      const newNth = { ...ntg };
      newNth[type] = newNth[type].filter(item => item != member);
      setNtg(newNth);
    } else {
      alert("Ошибка");
    }
  };

  return (
    <div className={collapsed ? 'notify-group-card onHover ' : "notify-group-card-opened"}>
      <div className='notify-group-header' onClick={() => setCollapsed(prev => !prev)}>
        <h3>{notifyGroup.name}</h3>
        <button className='btn' onClick={() => onDelete()}>Удалить</button>
      </div>
      <div className={`notify-group-body ${collapsed ? "collapsed" : ""}`}>
        <h4>Email активные</h4>
        <h4>Email доступные</h4>
        <h4>Telegram активные</h4>
        <h4>Telegram доступные</h4>
        <div>
          {ntg.email.map(item => <span key={item} onClick={() => RemoveMemberClick("email", item)}>{item}</span>)}
        </div>
        <div>
          {contacts.filter(item => item.email && ntg.email.indexOf(item.name) == -1).map(item => <span key={item.name} onClick={() => addMemberClick("email", item.name)}>{item.name}</span>)}
        </div>
        <div>
          {ntg.telegram.map(item => <span key={item} onClick={() => RemoveMemberClick("telegram", item)}>{item}</span>)}
        </div>
        <div>
          {contacts.filter(item => item.telegramId && ntg.telegram.indexOf(item.name) == -1).map(item => <span key={item.name} onClick={() => addMemberClick("telegram", item.name)}>{item.name}</span>)}
        </div>
      </div>
    </div>
  )
}

const NotifyGroupList = ({ icontacts }: { icontacts: iContact[] }) => {

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [newNotifyGroup, setNewNotifyGroup] = useState<string | null>(null);
  const [notifyGroups, setNotifyGroups] = useState<iNotifyGorup[]>([]);

  const getGroups = async () => {
    setNotifyGroups(await GetNotifyGroupsRequest());
    console.log(notifyGroups);
  }

  useEffect(() => {
    getGroups();
  }, [])

  const handleSaveClick = async () => {
    if (newNotifyGroup) {
      if (await AddNotifyGroupsRequest(newNotifyGroup)) {
        setNewNotifyGroup(null);
        await getGroups();
        console.log();
      } else {
        alert("Ошибка при сохранении группы");
      }
    }
  }

  const hadleDeleteClick = async (groupName: string) => {
    if (await DeleteNotifyGroupsRequest(groupName)) {
      await getGroups();
    } else {
      alert("Ошибка при удалении группы");
    }
  }

  return (
    <div>
      <h2 className='onHover' onClick={() => setCollapsed(prev => !prev)}>Группы рассылок</h2>
      <div className={`${collapsed ? "collapsed" : "notify-group-list"}`}>
        {notifyGroups.map(group => <NotiFyGroupCard icontacts={icontacts} notifyGroup={group} key={group.name} onDelete={() => { hadleDeleteClick(group.name) }} />)}
        {newNotifyGroup != null &&
          <div>
            <label>Имя группы:</label>
            <input type='text' value={newNotifyGroup} onChange={(e) => setNewNotifyGroup(e.target.value)} />
            <button className='btn' onClick={handleSaveClick}>Сохранить</button>
            <button className='btn' onClick={() => setNewNotifyGroup(null)}>Отменить</button>
          </div>
        }
        {newNotifyGroup == null &&
          <div key="new_group" onClick={() => setNewNotifyGroup("")}>
            <h1>+</h1>
          </div>
        }
      </div>
    </div>
  )
}

const ContactCard = ({ contact, update }: { contact: iContact, update: Function }): React.JSX.Element => {
  const [email, setEmail] = useState<string>(contact.email);
  const [telegramId, setTelegramId] = useState<string>(contact.telegramId);

  const hadnleButtonClick = async (action: string) => {
    let result = false;
    switch (action) {
      case "save": {
        result = await SaveContactRequest({ name: contact.name, email, telegramId });
        break;
      }
      case "delete": {
        result = await DeleteContactRequest(contact);
        break;
      }
    };
    if (result) {
      if (action == "save") alert("Успешно сохранено");
      else update();
    }
    else alert("Ошибка! Операция не выполнена");
  }

  return (
    <div className='contact-card custom-card'>
      <span>{contact.name}</span>
      <div>
        <label>Email:</label>
        <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>TelegramId:</label>
        <input type='text' value={telegramId} onChange={(e) => setTelegramId(e.target.value)} />
      </div>
      <button className='btn' onClick={() => hadnleButtonClick("save")}>Сохранить</button>
      <button className='btn' onClick={() => hadnleButtonClick("delete")}>Удалить</button>
    </div>
  )
}

const ContactsList = ({ contacts, update }: { contacts: iContact[], update: Function }) => {

  const [newContact, setNewContact] = useState<iContact | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const handleSaveClick = async () => {
    if (newContact) {
      if (await AddContactRequest(newContact)) {
        setNewContact(null);
        update();
      } else {
        alert("Ошибка при сохранении контакта");
      }
    }
  }

  return (
    <div>
      <h3 className='onHover' onClick={() => setCollapsed(prev => !prev)}>Список контактов</h3>
      <div className={`contact-list-body ${collapsed ? "collapsed" : ""}`}>
        {contacts && contacts.map(contact => { return <ContactCard contact={contact} key={contact.name} update={update} /> })}
        {newContact ?
          <div className='contact-card'>
            <div>
              <label>Контакт:</label>
              <input type='text' value={newContact.name} onChange={(e) => setNewContact(prev => { return { email: "", telegramId: "", ...prev, name: e.target.value } })} />
            </div>
            <div>
              <label>Email:</label>
              <input type='text' value={newContact.email} onChange={(e) => setNewContact(prev => { return { name: "", telegramId: "", ...prev, email: e.target.value } })} />
            </div>
            <div>
              <label>TelegramId:</label>
              <input type='text' value={newContact.telegramId} onChange={(e) => setNewContact(prev => { return { email: "", name: "", ...prev, telegramId: e.target.value } })} />
            </div>
            <button className='btn' onClick={handleSaveClick}>Сохранить</button>
            <button className='btn' onClick={() => setNewContact(null)}>Отменить</button>
          </div>
          :
          <div className='contact-card' key="new_contact" onClick={() => setNewContact({ name: "", email: "", telegramId: "" })}>
            <h1>+</h1>
          </div>

        }
      </div>
    </div>
  )
}



function App() {
  const [contacts, setContacts] = useState<iContact[] | null>(null);
  const getContacts = async () => {
    setContacts(await GetContactsRequest());
  }

  const [passwords, setPassword] = useState({ oldPass: "", newPass: "", newPass2: "" });
  const changePassword = async () => {
    const { oldPass, newPass, newPass2 } = passwords;
    if (!oldPass || !newPass || !newPass2) {
      alert("Введите все пароли");
      return;
    }
    if (newPass !== newPass2) {
      alert("Пароли не совпадают!");
      return;
    }

    const response = await fetch(`${API_URL}api/user`, {
      headers: [
        ["content-type", "application/json; charset=utf-8"]
      ],
      method: "POST",
      body: JSON.stringify({ username: "admin", password: oldPass, newPassword: newPass })
    });

    if (response.status == 200) {
      setPassword({ oldPass: "", newPass: "", newPass2: "" });
      alert("Смена пароля успешна")
    }
    else alert("Ошибка при смене пароля");
  }

  const [telegramSettings, setTelegramSettings] = useState({ token: "", name: "" });
  const getTelegramSettings = async () => {
    const response = await fetch(`${API_URL}api/telegram`)
    if (response.status == 200) {
      const body = await response.json();
      setTelegramSettings(body);
    }
  }
  const saveTelegramSettings = async () => {
    const { token, name } = telegramSettings;
    const response = await fetch(`${API_URL}api/telegram`, {
      method: "POST",
      headers: [
        ["content-type", "application/json; charset=utf-8"]
      ],
      body: JSON.stringify({ token, name })
    }
    )
    if (response.status == 200) {
      setTelegramSettings(prev => ({ ...prev, name }));
      alert("Настройки сохранены");
    }
    else alert("Ошибка сохранении настроек");
  }


  const [emailSettings, setEmailSettings] = useState({ host: "", port: "", username: "", password: "" });
  const getEmailSettings = async () => {
    const response = await fetch(`${API_URL}api/email`)
    if (response.status == 200) {
      const body = await response.json();
      setEmailSettings(body);
    }
  }
  const saveEmailSettings = async () => {
    const response = await fetch(`${API_URL}api/email`, {
      method: "POST",
      headers: [
        ["content-type", "application/json; charset=utf-8"]
      ],
      body: JSON.stringify(emailSettings)
    }
    )
    if (response.status == 200) {
      setEmailSettings(prev => ({ ...prev, password: "" }));
      alert("Настройки сохранены")
    }
    else alert("Ошибка сохранении настроек");
  }

  useEffect(() => {
    // document.body.classList.toggle('dark-theme-variables')
    getContacts();
    getTelegramSettings();
    getEmailSettings();
  }, []);

  return (
    <div className='main-container'>
      <h1>Notifier Control Panel</h1>
      <div className='control-container'>
        <h2>Администрирование</h2>
        <div>
          <h3>Общие настройки</h3>
          <label>Старый пароль</label>
          <input type='password' onChange={(e) => setPassword((prev) => { return { ...prev, oldPass: e.target.value } })} />

          <label>Новый пароль</label>
          <input type='password' onChange={(e) => setPassword((prev) => { return { ...prev, newPass: e.target.value } })} />

          <label>Повторите новый пароль</label>
          <input type='password' onChange={(e) => setPassword((prev) => { return { ...prev, newPass2: e.target.value } })} />

          <button className='btn' onClick={changePassword}>Сменить пароль</button>
        </div>
        <div>
          <h3>Настройки телеграм бота</h3>
          <label>Название бота</label>
          <input type='text' value={telegramSettings.name} onChange={(e) => setTelegramSettings(prev => { return { ...prev, name: e.target.value } })} />
          <label>Токен</label>
          <input type='password' value={telegramSettings.token} placeholder='Оставьте пустым что бы не изменять' onChange={(e) => setTelegramSettings(prev => { return { ...prev, token: e.target.value } })} />
          <button className='btn' onClick={saveTelegramSettings}>Сохранить</button>
        </div>
        <div>
          <h3>Настройки почтового ящика</h3>
          <label>Сервер</label>
          <input type='text' value={emailSettings.host} onChange={(e) => setEmailSettings(prev => { return { ...prev, host: e.target.value } })} />
          <label>Порт</label>
          <input type='text' value={emailSettings.port} onChange={(e) => setEmailSettings(prev => { return { ...prev, port: e.target.value } })} />
          <label>Логин</label>
          <input type='text' value={emailSettings.username} onChange={(e) => setEmailSettings(prev => { return { ...prev, username: e.target.value } })} />
          <label>Пароль</label>
          <input type='password' value={emailSettings.password} placeholder='Оставьте пустым что бы не изменять' onChange={(e) => setEmailSettings(prev => { return { ...prev, password: e.target.value } })} />
          <button className='btn' onClick={saveEmailSettings}>Сохранить</button>
        </div>
      </div >
      {contacts && <NotifyGroupList icontacts={contacts} />}
      {contacts && <ContactsList contacts={contacts} update={getContacts} />}
    </div>
  )
}

export default App
