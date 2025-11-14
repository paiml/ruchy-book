// BENCH-006: File Line Processing - C
#include <stdio.h>
#include <string.h>
#include <ctype.h>

int count_error_lines(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("fopen");
        return -1;
    }

    int count = 0;
    char line[1024];
    
    while (fgets(line, sizeof(line), file)) {
        // Convert to lowercase and check for "error"
        char lower[1024];
        int i;
        for (i = 0; line[i] && i < 1023; i++) {
            lower[i] = tolower(line[i]);
        }
        lower[i] = '\0';
        
        if (strstr(lower, "error")) {
            count++;
        }
    }
    
    fclose(file);
    return count;
}

int main() {
    int result = count_error_lines("testdata/bench-006-logs-100mb.txt");
    printf("%d\n", result);
    // Expected: 126076
    return 0;
}
