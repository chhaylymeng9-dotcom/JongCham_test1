        <aside className="lp-rail">
          <div className="lp-stats">
            <span className="lp-stat">
              {RAIL_ICONS.streak}
              <b>{streak}</b>
              <i>{t("lp.rail.streak")}</i>
            </span>
            <span className="lp-stat">
              {RAIL_ICONS.apples}
              <b>{apples}</b>
              <i>{t("lp.rail.apples")}</i>
            </span>
            <button type="button" className="lp-stat" style={{border:"none",padding:0,font:"inherit",color:"inherit"}} onClick={() => window.open("/pomo.html", "pomo", "width=400,height=800")}>
              {RAIL_ICONS.done}
              <b>{doneCount}</b>
              <i>{t("lp.rail.lessons")}</i>
            </button>
          </div>
