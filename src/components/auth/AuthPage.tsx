"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { PointerVideo } from "./PointerVideo";
import styles from "./auth.module.css";

export function AuthPage({ register = false }: { register?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [reset, setReset] = useState(false);
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (register && data.get("password") !== data.get("confirm")) {
      setMessage("两次输入的密码不一致，请重新输入。");
      return;
    }
    setMessage(reset ? "当前为界面演示，暂未接入密码重置服务。" : `信息填写完成。当前为界面演示，暂未接入${register ? "注册" : "登录"}服务。`);
  }
  const passwordField = (confirm = false) => (
    <div className={styles.field}>
      <label htmlFor={confirm ? "confirm" : "password"}>{confirm ? "确认密码" : "密码"}</label>
      <div className={styles.inputWrap}>
        <input id={confirm ? "confirm" : "password"} name={confirm ? "confirm" : "password"} type={showPassword ? "text" : "password"} placeholder={confirm ? "再次输入你的密码" : "输入你的密码"} autoComplete={register ? "new-password" : "current-password"} minLength={register ? 8 : undefined}
          onFocus={() => setPasswordFocused(true)}
          onBlur={(event) => {
            // Keep eyes shut when tabbing between the two registration passwords.
            // Use the field name: showing the password changes its input type.
            const next = event.relatedTarget;
            setPasswordFocused(next instanceof HTMLInputElement && (next.name === "password" || next.name === "confirm"));
          }}
          required />
        {!confirm && <button type="button" className={styles.eye} onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "隐藏密码" : "显示密码"} aria-pressed={showPassword}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{!showPassword && <path d="m3 21 18-18"/>}</svg>
        </button>}
      </div>
    </div>
  );
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-label={register ? "注册 CrowMesh 账号" : "登录 CrowMesh"}>
        <PointerVideo eyesClosed={passwordFocused && !reset} />
        <div className={`${styles.panel} ${register ? styles.register : ""}`}>
          <Link href="/login" className={styles.brand} aria-label="CrowMesh 登录"><Image src="/logo.svg" width={48} height={48} alt="" priority /><span>CrowMesh</span></Link>
          <header className={styles.heading}><h1>{reset ? "忘记密码？" : register ? "创建账号" : "欢迎回来！"}</h1><p>{reset ? "输入邮箱，找回您的账号" : register ? "填写以下信息，开启您的旅程" : "请在下方填写您的信息"}</p></header>
          <form onSubmit={submit} className={styles.form} onChange={() => setMessage("")}>
            <div className={styles.field}><label htmlFor="email">邮箱</label><div className={styles.inputWrap}><input id="email" name="email" type="email" placeholder="输入你的邮箱账号" autoComplete="email" required /></div></div>
            {!reset && passwordField()}
            {register && passwordField(true)}
            {!reset && !register && <div className={styles.options}><label className={styles.remember}><input type="checkbox" name="remember" />记住我</label><button type="button" onClick={() => { setReset(true); setMessage(""); }}>忘记密码?</button></div>}
            <button className={styles.submit} type="submit">{reset ? "重置密码" : register ? "注 册" : "登 录"}</button>
            <p className={styles.message} role="status">{message}</p>
          </form>
          <div className={styles.switch}>{reset ? <button onClick={() => { setReset(false); setMessage(""); }}>返回登录</button> : <><span>{register ? "已经有账户了?" : "还没有账户吗?"}</span> <Link href={register ? "/login" : "/register"}>{register ? "立即登录" : "注册账号"}</Link></>}</div>
        </div>
      </section>
    </main>
  );
}
