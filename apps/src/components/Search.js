export default function Search(id, n) {
  let input, filter, table, tr, td, i, txtValue, distance;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById(id);
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[n];
    if (td) {
      txtValue = td.textContent.toUpperCase() || td.innerText.toUpperCase();
      // Levenshtein Distance
      const track = Array(txtValue.length + 1)
        .fill(null)
        .map(() => Array(filter.length + 1).fill(null));
      for (let i = 0; i <= filter.length; i += 1) {
        track[0][i] = i;
      }
      for (let j = 0; j <= txtValue.length; j += 1) {
        track[j][0] = j;
      }
      for (let j = 1; j <= txtValue.length; j += 1) {
        for (let i = 1; i <= filter.length; i += 1) {
          const indicator = filter[i - 1] === txtValue[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator // substitution
          );
        }
      }
      distance = track[txtValue.length][filter.length];
      if (txtValue.toUpperCase().indexOf(filter) > -1 || distance <= 3) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
