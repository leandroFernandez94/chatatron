import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import StoreContext from "../../contexts/StoreContext";
import { routes } from "../../Router";

import styles from "./SelectInitialRooms.module.css";

export function SelectInitialRooms() {
  const { initialRooms, loadInitialRooms, selectInitialRooms } =
    useContext(StoreContext);

  const history = useHistory();

  useEffect(() => {
    loadInitialRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedRooms = Array.from(e.currentTarget.elements)
      .filter((el: Element) => (el as HTMLInputElement).checked)
      .map((el: Element) => Number((el as HTMLInputElement).name));

    console.log(selectedRooms);

    await selectInitialRooms(selectedRooms);

    history.replace(routes.selectRoom);
  };

  return (
    <section className={styles.selectInitialRooms}>
      <h1>Select Initial Rooms</h1>
      <form onSubmit={handleSubmit} className={styles.initialRoomsForm}>
        {initialRooms.map((room) => (
          <label className={styles.roomCheckboxLabel}>
            <input type="checkbox" name={room.id.toString()} />
            {room.name}
          </label>
        ))}
        <button type="submit" className={styles.initialRoomsSubmitButton}>
          Continue
        </button>
      </form>
    </section>
  );
}
