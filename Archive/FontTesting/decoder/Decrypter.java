import java.util.ArrayList;
import java.util.Scanner;

public class Decrypter {
    public static String decrypt(String input) {
        ArrayList<String> bin = new ArrayList<String>();
        for (int i = 0; i < input.length(); i++) {
            bin.add(String.valueOf(input.charAt(i)));
        }
        String[] bin2 = new String[bin.size()];
        bin2 = bin.toArray(bin2);
        String[] original = new String[] { " ", "!", ",", ".", ";", ":", "?", "'", "’", "\"", "\\", "|", "[", "]", "&",
                "—", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
                "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" };
        String[] cipher = new String[] { " ", "!", ",", ".", ";", ":", "?", "'", "’", "\"", "\\", "|", "[", "]", "&",
                "—", "l", "z", "y", "v", "g", "E", "h", "i", "I", "V", "r", "Q", "N", "n", "T", "j", "c", "t", "W", "s",
                "o", "q", "u", "D", "P", "a", "x", "e", "p", "R", "O", "K", "Z", "H", "S", "A", "k", "M", "U", "w", "G",
                "d", "C", "L", "f", "Y", "J", "B", "b", "X", "m", "F" };
        StringBuilder output = new StringBuilder();
        for (String s : bin2) {
            for (int k = 0; k < cipher.length; k++) {
                if (original[k].equals(s)) {
                    output.append(cipher[k]);
                }
            }
        }
        return String.valueOf(output);
    }

    public static void main(String[] args) {
        // sample input in line below:
        // j NUwAb pUWwR cbKcbRWZAAC TWEEbTRT HRTbAs, nGbRGbK RGHT bNp wb NUR RGb zHNZA qZWTb Us RGb mNHDbKTb; ZNp nGbRGbK NZRWKb UWRnZKpAC baHTRT. IR HT Z TWssHQHbNR ZQQUWNR Us RGZR jccbZKZNQb nb QZAA RGb SUKAp, RGZR oUp nHAA RbZQG Z GWyZN yHNp, ZNp TU yZkbT HR RGb KbQbHDbK Us Z QbKRZHN NWywbK Us
        Scanner sc = new Scanner(System.in);
        String test = sc.nextLine();
        System.out.println(decrypt(test));
        sc.close();
    }
}