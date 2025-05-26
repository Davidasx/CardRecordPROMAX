#include <bits/stdc++.h>
using namespace std;
int n,m;
vector<pair<int, int>> kp;
bool cmp(pair<int, int> a, pair<int, int> b){
    if(a.second>b.second) return true;
    return a.first>b.first;
}

int power(int a, int b){
    long long ans=1;
    for(int i=0;i<b;i++){
        ans *= a;
    }
    return ans;
}

struct solution {
    map<int, int> solutioncount = {};
    int num_of_solution(int n){
        return solutioncount[n];
    }
} sol;

void process_solution(int k1, int p1, int k2, int p2, int k3, int p3){
    if(k3 == 0 && p3 == 0){
        for(int i=1; i<=m; i++)for(int j=1; j<=m; j++){
            if(sol.solutioncount[power(i, p1) * k1 + power(j, p2) * k2]){
                sol.solutioncount[power(i, p1) * k1 + power(j, p2) * k2]++;
            }else sol.solutioncount[power(i, p1) * k1 + power(j, p2) * k2] = 1;
        }
        return;
    }
    for(int i=1; i<=m; i++)for(int j=1; j<=m; j++)for(int k=1; k<=m; k++){
        if(sol.solutioncount[power(i, p1) * k1 + power(j, p2) * k2] + power(k, p3) * k3){
            sol.solutioncount[power(i, p1) * k1 + power(j, p2) * k2 + power(k, p3) * k3]++;
        }else sol.solutioncount[power(i, p1) * k1 + power(j, p2) * k2 + power(k, p3) * k3] = 1;
    }
    // for(auto it = sol.solutioncount.begin(); it != sol.solutioncount.end(); it++){printf("%d %d\n", it->first, it->second);}
}

int numofsols(vector<pair<int, int>> kp, int tot){
    if(kp.size() <= 3)return sol.num_of_solution(tot);
    int cnt = 0;
    vector<pair<int, int>> nw;
    for(int i=0;i<kp.size()-1;i++)nw.push_back(kp[i]);
    for(int i=1; i<=m; i++){
        int a = numofsols(nw, tot - power(i, kp[kp.size()-1].second) * kp[kp.size()-1].first);
        // for(int i=0;i<kp.size();i++)printf("%d %d ", kp[i].first, kp[i].second);
        // printf("%d -> %d\n", tot, a);
        cnt += a;
    }
    // if(nw.size() == 4)printf("awa\n");
    return cnt;
}

int main(){
    cin>>n;
    cin>>m;
    for(int i=0;i<n;i++){
        int a, b;
        cin>>a>>b;
        kp.push_back(make_pair(a,b));
    }
    if(n==1){
        if(kp[0].first == 0)cout<<m;
        else cout<<0;
        return 0;
    }
    sort(kp.begin(), kp.end(), cmp);
    kp.push_back(make_pair(0,0));
    process_solution(kp[0].first, kp[0].second, kp[1].first, kp[1].second, kp[2].first, kp[2].second);
    vector<pair<int, int>> nw;
    for(int i=0;i<kp.size()-1;i++)nw.push_back(kp[i]);
    printf("%d", numofsols(nw, 0));
    return 0;
}