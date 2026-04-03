function StarRating({ value }) {
    const max = 5;
    return (
      <span className="inline-flex text-yellow-400 text-sm">
        {Array.from({ length: max }).map((_, index) => {
          const starIndex = index + 1;
          return (
            <span key={starIndex}>
              {starIndex <= value ? "★" : "☆"}
            </span>
          );
        })}
      </span>
    );
  }
  
  export default StarRating;