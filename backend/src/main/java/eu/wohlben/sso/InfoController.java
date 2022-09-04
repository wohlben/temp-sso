package eu.wohlben.sso;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class InfoController {


    @GetMapping(path="/info")
    Info getInfo() {
        return new Info("👍");
    }

    static record Info (String info) {}

}
