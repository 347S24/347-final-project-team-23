import { Link } from 'react-router-dom';
import "./styles.css";
import PropTypes from 'prop-types';

function Nav(props) {
  const scrollToElement = (id) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      } else {
          console.error(`Element with ID "${id}" not found.`);
      }
  };

  return (
      <nav>
          <ul className={"top-bar"}>
              {props.links.map((item) => (
                  <li key={item.anchor} className={"nav-item-top"}>
                      <Link
                          to={item.to}
                          className={"nav-link"}
                          onClick={() => item.anchor && scrollToElement(item.anchor)}
                      >
                          {item.label}
                      </Link>
                  </li>
              ))}
          </ul>
      </nav>
  )
}


Nav.propTypes = {
  section: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      anchor: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Nav;
