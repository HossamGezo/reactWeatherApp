import {useState, useEffect} from "react";
import CloudIcon from "@mui/icons-material/Cloud";
import axios from "axios";
import "../styles/WeatherApp.css";
import "../styles/Tabs.css";
import {useTranslation} from "react-i18next";
// - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Latitude & Langitude For Countries

const latLong = [
  {
    id: 1,
    country: "Egypt",
    city: "Cairo",
    lat: 30.06263,
    lon: 31.24967,
  },
  {
    id: 2,
    country: "Saudi Arabia",
    city: "Makkah",
    lat: 21.422487,
    lon: 39.826206,
  },
  {
    id: 3,
    country: "Palestine",
    city: "Jerusalem",
    lat: 31.7683,
    lon: 31.7683,
  },
  {
    id: 4,
    country: "United Kingdom",
    city: "London",
    lat: 51.50735,
    lon: -0.12776,
  },
  {
    id: 5,
    country: "United States",
    city: "Manhattan",
    lat: 40.776676,
    lon: -73.971321,
  },
];

// A vairable work only at the first time
let first = true;

// - - - - - Weather App

const WeatherApp = () => {
  // - - - Loading State && Tabs && Language
  const [isLoading, setIsLoading] = useState(false);
  const [tabState, setTabState] = useState(1);
  const [lang, setLang] = useState("ar");
  // - - - Fetched Data State
  const [fetchedData, setFetchedData] = useState({
    city: "",
    temp: "",
    maxTemp: "",
    minTemp: "",
    weatherDescription: "",
    time: "",
    icon: null,
  });
  // - - - Fetching Data
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${
            latLong[tabState - 1].lat
          }&lon=${
            latLong[tabState - 1].lon
          }&appid=9c395aed04828f524d7dcd7d303b0194`
        );
        if (res.data) {
          setIsLoading(false);
          setFetchedData({
            city: res.data.name,
            temp: Math.trunc(res.data.main.temp - 271.15),
            maxTemp: Math.ceil(res.data.main.temp_max - 271.15),
            minTemp: Math.floor(res.data.main.temp_min - 271.15),
            weatherDescription: res.data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
            time:
              lang === "ar"
                ? new Date().toLocaleDateString("ar-eg")
                : new Date().toLocaleDateString(),
          });
        }
      } catch (error) {
        throw Error(error);
      }
    };
    getData();
  }, [tabState, lang]);
  // - - - Functions
  // - Translation
  const {t, i18n} = useTranslation();
  if (first) {
    i18n.changeLanguage("ar");
    first = false;
  }
  const handleLanguageClick = () => {
    if (lang === "en") {
      i18n.changeLanguage("ar");
      setLang("ar");
    } else {
      i18n.changeLanguage("en");
      setLang("en");
    }
  };
  // - Handle Click
  const handleClick = (tabId) => {
    setTabState(tabId);
  };
  return (
    <>
      {isLoading && <h1 style={{color: "white"}}>Loading...</h1>}
      {!isLoading && (
        <div style={{direction: lang === "ar" ? "rtl" : "ltr"}}>
          <ul className="tabs">
            {latLong.map((tab) => (
              <li
                className={tabState === tab.id ? "active tab" : "tab"}
                key={tab.id}
                value={tab.id}
                onClick={() => handleClick(tab.id)}
              >
                {t(tab.country)}
              </li>
            ))}
          </ul>
          <div className="weatherCard">
            {/* Weather Card Head */}
            <div className="weatherCard__head">
              <h1 className="city">{t(fetchedData.city)}</h1>
              <p className="date">{fetchedData.time}</p>
            </div>
            {/* Weather Card Body */}
            <div className="weatherCard__body">
              {/* Card Body Details */}
              <div className="details">
                {/* ---------- */}
                <div className="degree">
                  <div className="number">{fetchedData.temp}</div>
                  <div className="icon">
                    <img src={fetchedData.icon} alt="Icon" />
                  </div>
                </div>
                {/* ---------- */}
                <div
                  className="desciption"
                  style={{textTransform: "capitalize"}}
                >
                  {t(fetchedData.weatherDescription)}
                </div>
                <div className="maxMin">{`${
                  lang === "ar" ? "الدرجه القصوي" : "Maximum"
                } : ${fetchedData.maxTemp} | ${
                  lang === "ar" ? "الدرجه الصغري" : "Minimum"
                } ${fetchedData.minTemp}`}</div>
              </div>
              {/* Card Body Big Icon */}
              <div className="bigIcon">
                <CloudIcon style={{fontSize: "11rem"}} />
              </div>
            </div>
          </div>
          <button
            style={{
              backgroundColor: "#093f9e",
              color: "white",
              padding: "0.5rem 1rem",
              Outline: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              marginTop: "10px",
              boxShadow: "0 5px 15px 0 #3570d5",
              transition:
                "background-color 0.3s linear, box-shadow 0.3s linear",
            }}
            onClick={handleLanguageClick}
          >
            {lang === "en" ? "Arabic" : "English"}
          </button>
        </div>
      )}
    </>
  );
};

export default WeatherApp;
