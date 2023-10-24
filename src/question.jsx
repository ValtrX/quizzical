function Question(props) {
  const allOptions = props.allAnswers.map((option) => {
    let styles = {};

    if (option === props.selectedOption) {
      styles = { backgroundColor: "#8a8ad4" };
    }

    if (props.checked) {
      if (option === props.selectedOption) {
        styles = { backgroundColor: "#F8BCBC" };
      }

      if (option === props.correctAnswer) {
        styles = {
          backgroundColor: "#94D7A2",
          border: "none",
        };
      }
    }

    return (
      <label style={styles} key={option}>
        <input
          type="radio"
          value={option}
          checked={props.selectedOption === option}
          onChange={props.onOptionChange}
        />
        {option}
      </label>
    );
  });

  return (
    <div>
      <h2>{props.questionTitle}</h2>
      {allOptions}
    </div>
  );
}

export default Question;
